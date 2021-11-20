import React, { useState } from "react";
import ProfileLoader from "./ProfileLoader";
import _web3 from "../decent_network/getWeb3";

const RequireWallet = (props) => {
  const [account, setAccount] = useState(null);

  const handleClick = async () => {
    const web3 = await _web3;
    setAccount((await web3.eth.getAccounts())[0]);
  };

  console.log(account);
  return account ? (
    <ProfileLoader account={account} />
  ) : (
    <button onClick={handleClick}>Connect</button>
  );
};

export default RequireWallet;
