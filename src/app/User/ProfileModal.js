import { useState } from "react"
import { Box, Button, Typography, Modal, Divider} from "@mui/material"
import EditProfile from "./editProfile";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '50%',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  overflow: "auto"
};

export default function ProfileModal({profile, haveAccount, readProfile}) {
  const [edit, setEdit] = useState(false)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if(!haveAccount){

  }

  return (
    <div>
      {haveAccount ? (
        <>
      <Button onClick={handleOpen}>View Profile</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-profile"
        aria-describedby="modal-modal-viewDescription"
      >
        <Box sx={style}>
          <Typography id="modal-modal-profile" variant="h5" component="h2">
          Profile
          </Typography>
          <br></br>
          <Divider />
          <br></br>
          <Typography variant="h6">
            {profile.name}
          </Typography>
          <br></br>
           <img height="150px" alt="profileAvatar" src={profile.avatar} />
          <br></br>
          <Typography id="modal-modal-viewDescription" sx={{ mt: 2 }}>
            Description:
            <br></br>
            {profile.description}
          </Typography>
          <br></br><br></br>
          {edit ? (<EditProfile profile={profile} haveAccount={haveAccount} readProfile={readProfile} setEdit={setEdit} />) : (<></>)}
          <Button onClick={()=> setEdit(!edit)}>
            {edit ? ('Cancel') : ('Edit')}
          </Button>
        </Box>
      </Modal>
        </>
      ) : (
        <>
        <Typography variant="h4">
        Create profile
        </Typography>
        <EditProfile profile={profile} haveAccount={haveAccount} readProfile={readProfile} />
        </>
      )}
    </div>
  );
}
