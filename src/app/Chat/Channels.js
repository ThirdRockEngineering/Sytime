import React, { useState, useEffect } from "react";
import Channel from "./Channel";
import { setProfile } from "../../ceramicProfile/profile";
import { Box, Typography, Paper, Divider} from "@mui/material";

const Channels = ({
  channels,
  currentChannel,
  ipfs,
  id,
  setChannel,
  channel,
  setChannels,
  profile,
  updateProfileState,
}) => {
  useEffect(() => {
    if (Object.keys(channel).length) {
      const stringArray = Object.keys(channel)[0].split("-");
      const string = stringArray[1] + "-" + stringArray[0];
      if (
        !Object.keys(channels).includes(string) &&
        !Object.keys(channels).includes(channel)
      ) {
        setChannels({ ...channels, ...channel });
        updateProfileState(
          {
            ...profile,
            channels: { ...profile.channels, ...{ ...channels, ...channel } },
          },
          true
        );
        setProfile({
          ...profile,
          channels: { ...profile.channels, ...{ ...channels, ...channel } },
        });
      }
    }
  }, [channel]);
  console.log(channels)

  return (

    <>
      <Box>
        <Typography variant="h6">
          Channels
        </Typography>
        <Divider />
      </Box>
      <Box p={1} sx={{
        textAlign:"left"
      }}>
        {Object.keys(channels).filter((chan)=>channels[chan].peerName==="example_topic")
        .map((_channel, key) => {
          console.log(_channel)
          return (
            <Box key={key} p={1}>
              <Channel
                channel={channels[_channel]}
                currentChannel={currentChannel}
                self={id}
                ipfs={ipfs}
                setChannel={setChannel}
              />
            </Box>
          );
        })}
        </Box>
        <Box>
        <Typography variant="h6">
          Direct Messages
        </Typography>
        <Divider />
      </Box>
      <Box p={1} sx={{
        textAlign:"left"
      }}>
        {Object.keys(channels).filter((chan)=>channels[chan].peerName!=="example_topic").map((_channel, key) => {
          console.log(_channel)
          return (
            <Box key={key} p={1}>
              <Channel
                channel={channels[_channel]}
                currentChannel={currentChannel}
                self={id}
                ipfs={ipfs}
                setChannel={setChannel}
              />
            </Box>
          );
        })}
        </Box>
    </>
    // <div>
    //   <h3>Channels</h3>
    //   <ul>
    //     {Object.keys(channels).map((_channel, key) => {
    //       console.log(_channel)
    //       return (
    //         <div key={key}>
    //           <Channel
    //             channel={channels[_channel]}
    //             currentChannel={currentChannel}
    //             self={id}
    //             ipfs={ipfs}
    //             setChannel={setChannel}
    //           />
    //         </div>
    //       );
    //     })}
    //   </ul>
    // </div>
  );
};

export default Channels;
