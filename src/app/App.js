import img from "../public/image.png";
import "../public/CSS/App.css";
import React, { useEffect, useState } from "react";

import { trackPromise, usePromiseTracker } from "react-promise-tracker";

import { makeFileObject } from "./Utils/filemaker";
import { fetchProfile, setProfile } from "../ceramicProfile/profile";
import node from "../decent_network/ipfs";

import { Box, Typography, Paper, Grid } from "@mui/material";

//* Components

import EditProfile from "./User/editProfile";
import Messages from "./Chat/Messages";
import Peers from "./Chat/Peers";
import Channels from "./Chat/Channels";
import TypeMessage from "./Chat/TypeMessage";
//* Hooks
import { useChannels, useWeb3 } from "./Hooks/appHooks";
import { textAlign } from "@mui/system";
import ProfileModal from "./User/ProfileModal";

function App({ profile, readProfile, haveAccount, account, setProfile }) {
  const [value, setValue] = useState("Hello World!");

  //* Your current message that you've just sent
  const [message, setMessage] = useState({});

  //* List of connected peers
  const [peers, setPeers] = useState({});
  const [peer, setPeer] = useState({});
  const [currentChannel, setCurrentChannel] = useState({
    peerName: "example_topic",
    peerAcc: account,
    name: "example_topic",
  });
  const [channel, setChannel] = useState({});
  const [channels, setChannels] = useChannels(
    echo,
    account,
    setChannel,
    profile
  );
  const [file, setFile] = useState(null);

  //* Web3 stuff
  const [ipfs, id, color] = useWeb3(setChannels, echo, account, channels);
  const [username, setUsername] = useState(
    account.slice(0, 4) + "..." + account.slice(-4)
  );

  //* callback when someone publishi in channel
  async function echo(msg) {
    //* We have date here, but we don't use it now
    const d = new Date();
    let time = d.getTime();

    //* This is the way that we can read message from ipfs
    if (Buffer(msg.data).toString().length) {
      //* We are storing stringified JSON in message
      const message = JSON.parse(Buffer(msg.data).toString());
      if (message.type === "text") {
        //* Change message from state
        setMessage({
          username: message.username,
          message: message.value,
          color: message.color,
          channel: message.channel,
          time,
          type: message.type,
          profile: message.profile,
        });
      } else {
        // Also string
        setMessage({
          username: message.username,
          message: message.value,
          color: message.color,
          channel: message.channel,
          time,
          type: message.type,
          hash: message.hash,
          profile: message.profile,
        });
      }

      const obj = {};

      obj[`${message.account}`] = {
        id: message.id,
        username: message.username,
        account: message.account,
      };

      setPeer(obj);
    }
  }

  return (
    <>
      <Box
        sx={{
          Height: "100vh",
        }}
      >
        <Box
          className="App"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
        >
          {/* Top Nav */}

          <Box
            component={Paper}
            className="Sytime"
            gridColumn="span 2"
            square={true}
            sx={{
              backgroundColor: "#E3E3F2",
              maxHeight: "50px",
            }}
          >
            <Typography variant="h5" p={1}>
              <img src={img} className="App-logo" alt="logo" />
              {` Sytime `}
            </Typography>
          </Box>

          <Box
            component={Paper}
            className="CurrentChannel"
            gridColumn="span 8"
            square={true}
            p={1}
            sx={{
              backgroundColor: "#C9CAD8",
              maxHeight: "35px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              textAlign="left"
              fontWeight="lighter"
              fontSize="18px"
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                width: "100%",
                maxHeight: "30px",
              }}
            >
              {`#${currentChannel.peerName}`}
            </Typography>
          </Box>

          <Box
            component={Paper}
            className="Management"
            gridColumn="span 2"
            square={true}
            p={1}
            sx={{
              backgroundColor: "#E3E3F2",
              maxHeight: "50px",
            }}
          >
            <ProfileModal
              profile={profile}
              haveAccount={haveAccount}
              readProfile={readProfile}
            />
          </Box>

          {/* Mid Section */}

          <Box
            className="LeftSide"
            gridColumn="span 2"
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#EEEDE7",
              height: "calc(100vh - 50px)",
            }}
          >


            <Box
              className="Channels"
              p={1}
              sx={{
                overflow: "auto",
              }}
            >
              <Channels
                channels={channels}
                currentChannel={currentChannel}
                self={id}
                ipfs={ipfs}
                profile={profile}
                channel={channel}
                setChannels={setChannels}
                setChannel={setCurrentChannel}
                updateProfileState={setProfile}
              />
            </Box>
          </Box>

          <Box
            className="MiddleContainer"
            gridColumn="span 8"
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#FCFDFF",
              maxHeight: "calc(90vh - 50px)",
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              sx={{
                height: "100%",
              }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  flex: "1 1 auto",
                  height: "100%",
                  width: "100%",
                  overflow: "auto",
                  textAlign: "left",
                }}
              >
                <Messages
                  profile={profile}
                  channel={currentChannel.name}
                  message={message}
                  ipfs={ipfs}
                  echo={echo}
                  color={color}
                  setPeers={setPeers}
                  account={account}
                  username={username}
                  peers={peers}
                  peer={peer}
                />
              </Grid>

              {/* <Box
              className="profile"
              p={2}
              gridColumn="span 5"
              sx={{
                overflow: "auto",
              }}
            >
              <p>
                Simple test <code>ipfs-pubsub</code> with changing doc.
              </p>
              <p>Your wallet: {account}</p>
              <p>Your peer id: {id}</p>

            </Box> */}

              {/* Bottom */}

              <Grid item
            className="InputContainer"
            xs={12}
            p={1}
            sx={{
              minHeight:"10vh",
              flex:"1 1 auto",
              position: "sticky",
              bottom: "0",
              backgroundColor:"#C9CAD8"
            }}>
                <TypeMessage
                  value={value}
                  setValue={setValue}
                  setUsername={setUsername}
                  file={file}
                  ipfs={ipfs}
                  username={username}
                  color={color}
                  setFile={setFile}
                  channel={currentChannel.name}
                  profile={profile}
                  account={account}
                  id={id}
                />
              </Grid>
            </Grid>
          </Box>


          <Box
            className="RightSide"
            gridColumn="span 2"
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#EEEDE7",
            }}
          >
            <Box
              className="Peers"
              sx={{
                overflow: "auto",
              }}
            >
              <Peers
                peers={peers}
                peer={peer}
                channels={channels}
                setPeers={setPeers}
                id={id}
                username={username}
                ipfs={ipfs}
                color={color}
                echo={echo}
                setChannel={setChannel}
                account={account}
                profile={profile}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
