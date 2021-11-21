import React, { useEffect } from "react";
import Peer from "../User/Peer";
import { Box, Typography, Divider} from "@mui/material";

const Peers = ({
  peers,
  id,
  username,
  ipfs,
  color,
  echo,
  setChannel,
  account,
  channels,
  peer,
  profile,
  setPeers,
}) => {
  useEffect(() => {
    (async () => {
      if (Object.keys(peer).length) {
        setPeers({ ...peers, ...peer });
      }
    })();
  }, [peer]);

  return (
    <>
      <Typography variant="body2" fontSize="smaller" p={2} sx={{
        color:"gray"
      }}>
        Click name to Direct Message
      </Typography>
      <Typography variant="h6">
        Online
      </Typography>
      <Divider />
      <Box p={1}>
        {Object.keys(peers)
            .filter((peer) => peer !== account)
            .map((peer, key) => {
              return (
                <Box key={key} p={1}>
                  <Peer
                    peer={peers[`${peer}`]}
                    id={id}
                    self={username}
                    ipfs={ipfs}
                    color={color}
                    channels={channels}
                    echo={echo}
                    setChannel={setChannel}
                    account={account}
                    profile={profile}
                  />
                </Box>
              );
            })}
      </Box>
    </>

    // <div>
    //   <h3>Peers</h3>
    //   <ul>
    //     {Object.keys(peers)
    //       .filter((peer) => peer !== account)
    //       .map((peer, key) => {
    //         return (
    //           <div key={key}>
    //             <Peer
    //               peer={peers[`${peer}`]}
    //               id={id}
    //               self={username}
    //               ipfs={ipfs}
    //               color={color}
    //               channels={channels}
    //               echo={echo}
    //               setChannel={setChannel}
    //               account={account}
    //               profile={profile}
    //             />
    //           </div>
    //         );
    //       })}
    //   </ul>
    // </div>
  );
};

export default Peers;
