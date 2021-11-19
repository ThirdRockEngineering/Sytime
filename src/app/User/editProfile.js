import { useState, useEffect } from 'react'
import { setProfile } from '../../ceramicProfile/profile'

const EditProfile = ({ haveAccount, readProfile, profile, setEdit }) => {

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(''); //link for now
  const [description, setDescription] = useState('');


  async function setAccount () {
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
    <div className="UpdateProfile">
      <input placeholder="Name" defaultValue={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Avatar" defaultValue={avatar} onChange={e => setAvatar(e.target.value)} />
      <input placeholder="Description" defaultValue={description} onChange={ e=> setDescription(e.target.value)} />
      <button onClick={setAccount}> Submit</button>
    </div>
  )
}

export default EditProfile
