import React from "react";

const Peer = (props) => {
  const { peer, self, ipfs, color, setChannels, echo, channel } = props;

  async function connectWithPeer() {
    await ipfs.pubsub.subscribe(peer, echo);
    setChannels(await ipfs.pubsub.ls());

    await ipfs.pubsub.publish(
      peer,
      JSON.stringify({
        username: self,
        value: "wanna conect?",
        color,
        channel: peer,
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
