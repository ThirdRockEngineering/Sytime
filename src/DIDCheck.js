import { useState, useEffect } from 'react'

import CeramicClient from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'

import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'
import { IDX } from '@ceramicstudio/idx'

const endpoint = "https://ceramic-clay.3boxlabs.com"



const DIDCheck = () => {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loaded, setLoaded] = useState(false)


  async function connect() {
    const addresses = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })
    return addresses
  }

  async function readProfile() {
    const [address] = await connect()
    const ceramic = new CeramicClient(endpoint)
    const idx = new IDX({ ceramic }) //check docs for IDX config update

    try {
      const data = await idx.get(
        'basicProfile',
        `${address}@eip155:1`
      )
      console.log('data:', data)
      if(data.name) setName(data.name)
      if(data.avatar) setImage(data.avatar)
    } catch (err) {
      console.log('error:', err)
      setLoaded(true)
    }
  }

  async function updateProfile() {
    const [address] = await connect()
    const ceramic = new CeramicClient(endpoint)
    const threeIdConnect = new ThreeIdConnect()
    const provider = new EthereumAuthProvider(window.ethereum, address)

    await threeIdConnect.connect(provider)

    const did = new DID({
      provider: threeIdConnect.getDidProvider(),
      resolver: {
        ...ThreeIdResolver.getResolver(ceramic)
      }
    })

    ceramic.setDID(did)
    await ceramic.did.authenticate()

    const idx = new IDX({ceramic})

    await idx.set('basicProfile', {
      name,
      avatar: image
    })
    console.log('profile updated!')
  }


  return (
    <div className="App">
    <input placeholder="Name" onChange={e => setName(e.target.value)} />
    <input placeholder="Profile Image" onChange={e => setImage(e.target.value)} />
    <button onClick={updateProfile}>Set Profile</button>
    <button onClick={readProfile}>Read Profile</button>

    { name && <h3>{name}</h3> }
    { image && <img alt='avatar' style={{ width: '400px' }} src={image} /> }
    {(!image && !name && loaded) && <h4>No profile, please create one...</h4>}
  </div>
  )
}

export default DIDCheck;
