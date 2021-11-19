import React, { useState, useEffect } from "react";
import Peer from "../User/Peer";

const Peers = ({
  peers,
  id,
  username,
  ipfs,
  color,
  echo,
  setChannels,
  account,
  peer,
  setPeers,
}) => {
  useEffect(() => {
    (async () => {
      if (Object.keys(peer).length) {
        setPeers({ ...peers, ...peer });
      }
    })();
    console.log(peer, "from Peers");
  }, [peer]);

  return (
    <div>
      <h3>Peers</h3>
      <ul>
        {Object.keys(peers)
          .filter((peer) => peer !== account)
          .map((peer, key) => {
            return (
              <div key={key}>
                <Peer
                  peer={peers[`${peer}`]}
                  id={id}
                  self={username}
                  ipfs={ipfs}
                  color={color}
                  echo={echo}
                  setChannels={setChannels}
                  account={account}
                />
              </div>
            );
          })}
      </ul>
    </div>
  );
};

export default Peers;
