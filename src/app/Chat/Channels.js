import React, { useState, useEffect } from "react";
import Channel from "./Channel";

const Channels = ({ channels, currentChannel, ipfs, id, setChannel }) => {
  return (
    <div>
      <h3>Channels</h3>
      <ul>
        {channels.map((_channel, key) => {
          return (
            <div key={key}>
              <Channel
                channel={_channel}
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
