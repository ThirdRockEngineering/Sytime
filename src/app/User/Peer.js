import React from "react";

const Peer = (props) => {
  const { peer, self, ipfs, color, setChannels, echo, id } = props;

  async function connectWithPeer() {
    //* Subscribe to another peer's channel
    await ipfs.pubsub.subscribe(peer, async (msg) => {
      if (Buffer(msg.data).toString().length) {
        //* Subscbibe to channel between only two peers
        await ipfs.pubsub.subscribe(`${peer}-${id}`, echo);
        //* And immediately unsubscribe after new channel created
        await ipfs.pubsub.unsubscribe(peer);
        //* Update channel list
        setChannels(await ipfs.pubsub.ls());
      }
    });
    setChannels(await ipfs.pubsub.ls());

    //* Post a message to create a new channel for 2 peers
    await ipfs.pubsub.publish(
      peer,
      JSON.stringify({
        username: self,
        value: "wanna conect?",
        color,
        id: id,
      })
    );
  }

  return (
    <div>
      <button onClick={connectWithPeer}>{peer}</button>
    </div>
  );
};

export default Peer;
