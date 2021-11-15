import React, { useState, useEffect } from "react";

const Channel = (props) => {
  const { channel, self, ipfs } = props;

  return (
    <div>
      <button>{channel}</button>
    </div>
  );
};

export default Channel;
