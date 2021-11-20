import { useState, useEffect } from 'react'
import { setProfile } from '../../ceramicProfile/profile'
import { Box, Button, Typography, Modal, Divider, Paper, TextField} from "@mui/material"


const EditProfile = ({ haveAccount, readProfile, profile, setEdit, handleClose }) => {

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(''); //link for now
  const [description, setDescription] = useState('');


  async function setAccount (e) {
    e.preventDefault()
    const data = {name, avatar, description}
    await setProfile(data, haveAccount)
    if(setEdit) {
      setEdit()
    }
    await readProfile()
  }
  useEffect(()=>{
    if(profile){
      setName(profile.name)
      setAvatar(profile.avatar)
      setDescription(profile.description)
    }
  }, [profile])

  return (
    <Box component="form" onSubmit={setAccount} gridColumn="span 12" p={1}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" p={2} sx={{
        border:"1px solid black",
        borderRadius:"15px"
      }}>
      <Box gridColumn="span 5">
        <img maxHeight="100px" width="100px" alt="current avatar" src={avatar} />
      </Box>
        <Box gridColumn="span 7">
          <Typography variant="h6" maxHeight="30px" overflow="auto">
            {name}
          </Typography>
          <Divider />
          <Typography fontSize="small" overflow="auto" maxHeight="70px">
            {description}
          </Typography>
        </Box>
      </Box>

      <br></br>
      <TextField label="Username" value={name} onChange={e => setName(e.target.value)} fullWidth/>
      <br></br><br></br>
      <TextField label="Avatar(Link-only)" value={avatar} onChange={e => setAvatar(e.target.value)} fullWidth />
      <br></br><br></br>
      <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth multiline={true} />
      <br></br><br></br>
      <Button type="submit" fullWidth variant="outlined">Save Changes</Button>
      {!haveAccount ? (<Button color="secondary" fullWidth onClick={handleClose}>Cancel</Button>) : (<></>)}
    </Box>

    // <div className="UpdateProfile">
    //   <input placeholder="Name" defaultValue={name} onChange={e => setName(e.target.value)} />
    //   <input placeholder="Avatar" defaultValue={avatar} onChange={e => setAvatar(e.target.value)} />
    //   <input placeholder="Description" defaultValue={description} onChange={ e=> setDescription(e.target.value)} />
    //   <button onClick={setAccount}> Submit</button>
    // </div>
  )
}

export default EditProfile
