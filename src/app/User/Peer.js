import React, { useState, useEffect } from "react";

const Peer = (props) => {
  const { peer, self, ipfs } = props;

  async function connectWithPeer() {
    await ipfs.pubsub.subscribe(peer, (msg) => {
      if (Buffer(msg.data).toString().length) {
        //* We are storing stringified JSON in message
        const message = Buffer(msg.data).toString();
        console.log(message);
      }
    });
    await ipfs.pubsub.publish(peer, "wanna conect?");
  }

  return (
    <div>
      <button onClick={connectWithPeer}>{peer}</button>
    </div>
  );
};

export default Peer;
