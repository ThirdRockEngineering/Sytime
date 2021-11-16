import { useState, useEffect } from 'react'
import { updateProfile } from '../../ceramicProfile/profile'

const EditProfile = () => {

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(''); //link for now
  const [description, setDescription] = useState('');

  async function pushUpdate () {
    const data = {name, avatar, description}
    await updateProfile(data)
  }

  return (
    <div className="UpdateProfile">
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Avatar" onChange={e => setAvatar(e.target.value)} />
      <input placeholder="Description" onChange={ e=> setDescription(e.target.value)} />
      <button onClick={pushUpdate}> Submit</button>
    </div>
  )
}

export default EditProfile
