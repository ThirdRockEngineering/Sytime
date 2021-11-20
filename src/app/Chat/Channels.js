import React, { useState, useEffect } from "react";
import Channel from "./Channel";
import { setProfile } from "../../ceramicProfile/profile";

const Channels = ({
  channels,
  currentChannel,
  ipfs,
  id,
  setChannel,
  channel,
  setChannels,
  profile,
}) => {
  useEffect(() => {
    setChannels({ ...channels, ...channel });
    setProfile({ ...profile, channels: { ...channels, ...channel } }, true);
  }, [channel]);

  return (
    <div>
      <h3>Channels</h3>
      <ul>
        {Object.keys(channels).map((_channel, key) => {
          return (
            <div key={key}>
              <Channel
                channel={channels[_channel]}
                currentChannel={currentChannel}
                self={id}
                ipfs={ipfs}
                setChannel={setChannel}
              />
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Channels;
