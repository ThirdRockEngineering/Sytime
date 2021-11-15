import React, { useState, useEffect } from "react";

const Peer = (props) => {
  const { peer, self, ipfs } = props;

  function connectWithPeer() {}

  return (
    <div>
      <button onClick={connectWithPeer}>{peer}</button>
    </div>
  );
};

export default Peer;
