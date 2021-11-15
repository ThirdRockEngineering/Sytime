import React, { useState, useEffect } from "react";

const Peer = (props) => {
  const { peer, self, ipfs } = props;

  async function connectWithPeer() {
    await ipfs.pubsub.subscribe(peer, () => {
      console.log(self);
    });
  }

  return (
    <div>
      <button onClick={connectWithPeer}>{peer}</button>
    </div>
  );
};

export default Peer;
