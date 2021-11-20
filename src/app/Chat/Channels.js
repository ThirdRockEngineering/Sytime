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
