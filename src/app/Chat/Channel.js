import React, { useState, useEffect } from "react";
import { setProfile } from "../../ceramicProfile/profile";
import { Button } from "@mui/material";

const Channel = (props) => {
  const { channel, self, ipfs, currentChannel, setChannel } = props;

  return (
    <Button fullWidth onClick={()=> {
      setChannel(channel)
    }}>
      {channel.peerName}
    </Button>
  )

  // channel.peerName === currentChannel.peerName ? (
  //   <div>
  //     <button>
  //       <strong
  //         onClick={() => {
  //           setChannel(channel);
  //         }}
  //       >
  //         {channel.peerName}
  //       </strong>
  //     </button>
  //   </div>
  // ) : (
  //   <div>
  //     <button
  //       onClick={() => {
  //         setChannel(channel);
  //       }}
  //     >
  //       {channel.peerName}
  //     </button>
  //   </div>
  // );
};

export default Channel;
