import React, { useState } from "react";
import ProfileLoader from "./ProfileLoader";
import _web3 from "../decent_network/getWeb3";
import { Box, Button, Typography } from "@mui/material"
import image from "../public/image.png"
import "../public/CSS/App.css";
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
    <Box sx={{
      height: "100vh",
      display:"flex",
      alignItems:"center",
      justifyContent:"center"
    }}>
      <Box p={5} sx={{
        display:"flex",
        flexDirection:"column"
      }}>
      <img alt="logo" height="300px" className="Main-Logo" src={image} />
      <Typography variant="h2" textAlign="center" p={2}>
        Sytime
      </Typography>
      <Button variant="outlined" fullWidth onClick={handleClick}>Connect</Button>
      </Box>

    </Box>
  );
};

export default RequireWallet;
