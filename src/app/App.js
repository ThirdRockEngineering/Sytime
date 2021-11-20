import img from "../public/image.png";
import "../public/CSS/App.css";
import React, { useEffect, useState } from "react";

import { trackPromise, usePromiseTracker } from "react-promise-tracker";

import { makeFileObject } from "./Utils/filemaker";
import { setProfile } from "../ceramicProfile/profile";
import node from "../decent_network/ipfs";

import { Box, Typography } from "@mui/material";

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

function App({ profile, readProfile, haveAccount, account }) {
  //* Current message that displays in textarea
  // let haveAcc = haveAccount;
  // if (!haveAccount) {
  //   profile = {};
  //   haveAcc = true;
  // }
  // if (!profile.avatar) {
  //   profile.avatar = "QmXiYAbTQP4yMbjbNVJc4NyPskY88gwXqSoMPBPHrarGTe";
  // }
  // console.log("have?", haveAccount);

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
  //BasicProfile

  //* Color of your username that displays in chat

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
        });
      } else {
        //   //* Also strang
        setMessage({
          username: message.username,
          message: message.value,
          color: message.color,
          channel: message.channel,
          time,
          type: message.type,
          hash: message.hash,
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
      <Box className="App" display="grid" gridTemplateColumns="repeat(12, 1fr)">
        <Box
          className="NavBar"
          gridColumn="span 12"
          p={3}
          sx={{
            border: "1px solid black",
          }}
        >
          <Typography variant="h4">Sytime</Typography>
        </Box>

        <Box
          className="LeftSide"
          gridColumn="span 3"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box className="logo">
            <img src={img} className="App-logo" alt="logo" />
          </Box>

          <Box
            className="Channels"
            sx={{
              maxHeight: "10vw",
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
            />
          </Box>
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

        <Box
          className="ChatArea"
          gridColumn="span 9"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)">
            <Box
              className="Chat"
              gridColumn="span 7"
              sx={{
                minHeight: "20vw",
                maxHeight: "40vw",
                overflow: "auto",
                border: "1px solid black",
                textAlign: "left",
              }}
            >
              <Messages
                channel={currentChannel.name}
                message={message}
                ipfs={ipfs}
                setPeers={setPeers}
                account={account}
                username={username}
                peers={peers}
                peer={peer}
              />
            </Box>

            <Box
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
              <ProfileModal profile={profile} haveAccount={haveAccount} />
              {/* {haveAcc ? (
                <>
                  <p>Your Profile Name: {profile.name}</p>
                  <p>
                    Your Profile avatar:{" "}
                    <img
                      alt="avatar"
                      src={`https://ipfs.io/ipfs/${profile.avatar}`}
                    />
                  </p>
                  <p>Your Profile description: {profile.description}</p>
                </>
              ) : (
                <>
                  <p> No Account connected</p>
                </>
              )}
              <EditProfile
                readProfile={readProfile}
                haveAccount={haveAccount}
                profile={profile}
              /> */}
            </Box>
          </Box>
          <Box
            className="input"
            p={3}
            sx={{
              minHeight: "10vw",
              border: "1px solid black",
              textAlign: "left",
            }}
          >
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
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
