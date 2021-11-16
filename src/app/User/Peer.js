import React, { useState, useEffect } from "react";

const Peer = (props) => {
  const { peer, self, ipfs, setMessage, username, color, setChannels } = props;

  async function connectWithPeer() {
    await ipfs.pubsub.subscribe(peer, async (msg) => {
      const d = new Date();
      let time = d.getTime();

      //* This is the way that we can read message from ipfs
      if (Buffer(msg.data).toString().length) {
        //* We are storing stringified JSON in message
        const message = JSON.parse(Buffer(msg.data).toString());
        //* Change message from state
        setMessage({
          username: message.username,
          message: message.value,
          color: message.color,
          time,
        });
      }
      setChannels(await ipfs.pubsub.ls());
    });
    await ipfs.pubsub.publish(
      peer,
      JSON.stringify({ username: self, value: "wanna conect?", color })
    );
  }

  return (
    <div>
      <button onClick={connectWithPeer}>{peer}</button>
    </div>
  );
};

export default Peer;
