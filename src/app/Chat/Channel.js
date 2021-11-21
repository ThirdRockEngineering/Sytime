import React  from "react";
import { Button } from "@mui/material";

const Channel = (props) => {
  const { channel, setChannel } = props;

  return (
    <Button fullWidth onClick={()=> {
      setChannel(channel)
    }}>
      {channel.peerName}
    </Button>
  )
};

export default Channel;
