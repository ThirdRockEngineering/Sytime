import React, { useState, useEffect } from "react";
import { setProfile } from "../../ceramicProfile/profile";

const Channel = (props) => {
  const { channel, self, ipfs, currentChannel, setChannel } = props;

  return channel === currentChannel ? (
    <div>
      <button>
        <strong
          onClick={() => {
            setChannel(channel.peerName);
          }}
        >
          {channel.peerName}
        </strong>
      </button>
    </div>
  ) : (
    <div>
      <button
        onClick={() => {
          setChannel(channel.peerName);
        }}
      >
        {channel.peerName}
      </button>
    </div>
  );
};

export default Channel;
