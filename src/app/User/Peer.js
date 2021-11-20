import React from "react";

import { setProfile } from "../../ceramicProfile/profile";

const Peer = (props) => {
  const {
    peer,
    self,
    ipfs,
    color,
    setChannel,
    echo,
    id,
    account,
    channels,
    profile,
  } = props;

  async function connectWithPeer() {
    //* Subscribe to another peer's channel
    await ipfs.pubsub.subscribe(peer.id, async (msg) => {
      if (Buffer(msg.data).toString().length) {
        //* Subscbibe to channel between only two peers
        const _channels = await ipfs.pubsub.ls();
        if (
          !_channels.includes(`${peer.account}-${account}`) &&
          !_channels.includes(`${account}-${peer.account}`)
        ) {
          console.log(_channels);
          await ipfs.pubsub.subscribe(`${peer.account}-${account}`, echo);
          const obj = {};
          obj[`${peer.account}-${account}`] = {
            peerName: peer.username,
            peerAcc: peer.account,
            name: `${peer.account}-${account}`,
          };
          setChannel(obj);
        }
        //* And immediately unsubscribe after new channel created
        await ipfs.pubsub.unsubscribe(peer.id);
        //* Update channel list
      }
    });

    //* Post a message to create a new channel for 2 peers
    await ipfs.pubsub.publish(
      peer.id,
      JSON.stringify({
        username: self,
        value: "wanna conect?",
        color,
        id,
        type: "text",
        account,
      })
    );
  }
  return (
    <div>
      <button onClick={connectWithPeer}>{peer.username}</button>
    </div>
  );
};

export default Peer;
