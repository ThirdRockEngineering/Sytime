import { useState } from "react"
import { Box, Button, Typography, Modal, Divider, Paper} from "@mui/material"
import EditProfile from "./editProfile";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '60%',
  width: '25%',
  bgcolor: '#E2D9CA',
  boxShadow: 24,
  p: 2,
  textAlign: "left",
  overflow: "auto",
};

export default function ProfileModal({profile, haveAccount, readProfile}) {
  const [edit, setEdit] = useState(false)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!haveAccount) {
  }

  return (
    <div>
      <Button onClick={handleOpen}>
        {haveAccount ? ('View Profile'):('Create Profile')}
        </Button>
      {haveAccount ? (
        <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-profile"
        aria-describedby="modal-modal-viewDescription"
      >
        <Box component={Paper} sx={style} display="grid" gridTemplateColumns="repeat(12, 1fr)">

          <Box gridColumn="span 6">
          <Typography id="modal-modal-profile" variant="h5" component="h2" fontWeight="bolder">
           {edit ? ('Edit Profile') : ('Profile')}
          </Typography>
          </Box>
          <Box gridColumn="span 6" textAlign="right">
          <Button onClick={()=> setEdit(!edit)}>
            {edit ? ('Cancel') : ('Edit')}
          </Button>
          </Box>

          {edit ? (<EditProfile profile={profile} haveAccount={haveAccount} readProfile={readProfile} setEdit={setEdit} />) : (<>

          <Box gridColumn="span 12" >
          <Typography variant="body1" p={1} color="#42271F">
            Username:
          </Typography>
          </Box>

          <Box gridColumn="span 12"  >
          <Typography textAlign="center" variant="h6" p={1} color="#4A94A8" sx={{
            border: "2px solid #42271F",
            borderRadius:"15px",
            backgroundColor:"white"
          }}>
          {profile.name}
          </Typography>
          </Box>

          <Box gridColumn="span 12">
          <Typography variant="body1" p={1} color="#42271F">
            Avatar:
          </Typography>
          </Box>

          <Box gridColumn="span 12" sx={{
            textAlign:"center",
          }}>
            <img width="50%" alt="profileAvatar" src={profile.avatar} />
          </Box>

          <Box gridColumn="span 12">
          <Typography variant="body1" p={1} id="modal-modal-viewDescription" color="#42271F">
            Bio:
          </Typography>
          <Typography textAlign="center" variant="body2" p={1} sx={{

            backgroundColor:"white"
          }}>
            {profile.description}

          </Typography>
          </Box>
          </>)}
        </Box>
      </Modal>
        </>
      ) : (
        <>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-profile"
        aria-describedby="modal-modal-viewDescription"
      >
        <Box sx={style}>
          <Typography variant="h4">
          Create profile
          </Typography>

          <EditProfile profile={profile} haveAccount={haveAccount} readProfile={readProfile} />
          </Box>
        </Modal>

        </>
      )}
    </div>
  );
}
