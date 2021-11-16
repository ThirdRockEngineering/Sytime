import React from "react";

const Peer = (props) => {
  const { peer, self, ipfs, color, setChannels, echo, channel, id } = props;

  async function connectWithPeer() {
    await ipfs.pubsub.subscribe(peer, async (msg) => {
      if (Buffer(msg.data).toString().length) {
        //* We are storing stringified JSON in message
        const message = JSON.parse(Buffer(msg.data).toString());
        //* Change message from state
        await ipfs.pubsub.subscribe(`${peer}-${id}`, echo);
        await ipfs.pubsub.unsubscribe(peer);
        setChannels(await ipfs.pubsub.ls());
      }
    });
    setChannels(await ipfs.pubsub.ls());

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
