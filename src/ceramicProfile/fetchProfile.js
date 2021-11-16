import CeramicClient from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'

const endpoint = "https://ceramic-clay.3boxlabs.com"


async function fetchProfile(address){
  const ceramic = new CeramicClient(endpoint)
  const idx = new IDX({ ceramic })

  try {
    return await idx.get(
      'basicProfile',
      `${address}@eip155:1`
    )
    // console.log('DATA LOADED:', data)

  } catch(err) { console.log("Profile Error:", err)}
}

export default fetchProfile;
