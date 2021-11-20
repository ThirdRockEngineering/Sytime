import { useState } from "react";
import { Box, Button, Typography, Modal, Divider } from "@mui/material";
import EditProfile from "./editProfile";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProfileModal({ profile, haveAccount }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!haveAccount) {
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
              <Typography id="modal-modal-profile" variant="h6" component="h2">
                {profile.name}
              </Typography>
              <Divider />
              <br></br>
              <img
                alt="profileAvatar"
                src={profile.avatar}
                style={{ maxHeight: "400px", maxWidth: "400px" }}
              />
              <br></br>
              <Typography id="modal-modal-viewDescription" sx={{ mt: 2 }}>
                {profile.description}
              </Typography>
            </Box>
          </Modal>
        </>
      ) : (
        <>
          <Typography variant="h4">Create profile</Typography>
          <EditProfile profile={profile} haveAccount={haveAccount} />
        </>
      )}
    </div>
  );
}
