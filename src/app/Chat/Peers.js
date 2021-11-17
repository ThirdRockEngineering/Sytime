import React, { useState, useEffect } from "react";
import Peer from "../User/Peer";

const Peers = ({ peers, id, username, ipfs, color, echo, setChannels }) => {
  return (
    <div>
      <h3>Peers</h3>
      <ul>
        {peers.map((peer, key) => {
          return (
            <div key={key}>
              <Peer
                peer={peer}
                id={id}
                self={username}
                ipfs={ipfs}
                color={color}
                echo={echo}
                setChannels={setChannels}
              />
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Peers;
