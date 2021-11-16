import fetchProfile from '../ceramicProfile/fetchProfile'
import App from './App'
import { useEffect, useState } from 'react'


function ProfileLoader () {

  const [profile, setProfile] = useState({})
  const [name, setName] = useState('')

  useEffect(() => {
    (async () => {
      const addresses = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      const address = addresses[0]
      const data = await fetchProfile(address)
      setProfile(data)
    })();
  }, []);
  console.log('profile loader', profile)

  return (
    <>
    <App profile ={profile} />
    </>
  )
}

export default ProfileLoader
