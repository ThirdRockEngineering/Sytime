import { useState, useEffect } from 'react'

import CeramicClient from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'

import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'
import { IDX } from '@ceramicstudio/idx'

const endpoint = "https://ceramic-clay.3boxlabs.com"

export async function connect (){
  const addresses = await window.ethereum.request({
    method: 'eth_requestAccounts'
  })
  return addresses[0]
}

export async function fetchProfile(address) {
  const ceramic = new CeramicClient(endpoint)
  const idx = new IDX({ ceramic })

  try {
    return await idx.get(
      'basicProfile',
      `${address}@eip155:1`
    )
  } catch(err) {
    console.log("Profile Error:", err)
  }
}

export async function setProfile(data, account){
  const address = await connect()

  const ceramic = new CeramicClient(endpoint)
  const threeIdConnect= new ThreeIdConnect()
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

  if(!account){
    try {
      await idx.set('basicProfile', data)
    } catch(err) { console.log('creation failed', err)}
  } else {
    try {
      await idx.merge('basicProfile', data)
    } catch(err) { console.log('update failed', err)}
  }
}
