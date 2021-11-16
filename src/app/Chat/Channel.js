import React, { useState, useEffect } from "react";

const Channel = (props) => {
  const { channel, self, ipfs, currentChannel, setChannel } = props;

  return channel === currentChannel ? (
    <div>
      <button>
        <strong
          onClick={() => {
            setChannel(channel);
          }}
        >
          {channel}
        </strong>
      </button>
    </div>
  ) : (
    <div>
      <button
        onClick={() => {
          setChannel(channel);
        }}
      >
        {channel}
      </button>
    </div>
  );
};

export default Channel;
