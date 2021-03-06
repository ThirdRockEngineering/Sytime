import { useState, useEffect } from "react";
import { setProfile } from "../../ceramicProfile/profile";
import { Box, Button, Typography, Divider, TextField } from "@mui/material";
import defaultUser from "../../public/defaultUser.jpeg";

const EditProfile = ({
  haveAccount,
  readProfile,
  profile,
  setEdit,
  handleClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar); //link for now
  const [description, setDescription] = useState(profile.description);

  async function setAccount(e) {
    e.preventDefault();
    const data = { name, avatar, description };
    await setProfile(data, haveAccount);
    if (setEdit) {
      setEdit();
    }
    await readProfile();
  }
  useEffect(() => {
    if (profile) {
      console.log(profile);
      setName(profile.name);
      setAvatar(profile.avatar ? profile.avatar : defaultUser);
      setDescription(profile.description);
    }
  }, [profile]);

  return (
    <Box component="form" onSubmit={setAccount} gridColumn="span 12" p={1}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        p={2}
        sx={{
          border: "1px solid black",
          borderRadius: "15px",
        }}
      >
        <Box gridColumn="span 5">
          <img
            maxheight="100px"
            width="100px"
            alt="current avatar"
            src={avatar}
          />
        </Box>
        <Box gridColumn="span 7">
          <Typography variant="h6" maxheight="30px" overflow="auto">
            {name}
          </Typography>
          <Divider />
          <Typography fontSize="small" overflow="auto" maxHeight="70px">
            {description}
          </Typography>
        </Box>
      </Box>

      <br></br>
      <TextField
        label="Username"
        defaultValue={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <br></br>
      <br></br>
      <TextField
        label="Avatar(Link-only)"
        defaultValue={avatar}
        onChange={(e) => setAvatar(e.target.value)}
        fullWidth
      />
      <br></br>
      <br></br>
      <TextField
        label="Description"
        defaultValue={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline={true}
      />
      <br></br>
      <br></br>
      <Button type="submit" fullWidth variant="outlined">
        Save Changes
      </Button>
      {!haveAccount ? (
        <Button color="secondary" fullWidth onClick={handleClose}>
          Cancel
        </Button>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default EditProfile;
