import img from "../public/image.png";
import "../public/CSS/App.css";
import React, { useEffect, useState } from "react";

import { trackPromise, usePromiseTracker } from "react-promise-tracker";

import { makeFileObject } from "./Utils/filemaker";

import { Box, Typography } from "@mui/material";

//* Components
import EditProfile from "./User/editProfile";
import Messages from "./Chat/Messages";
import Peers from "./Chat/Peers";
import Channels from "./Chat/Channels";

//* Hooks
import { useName, useChannels, useWeb3 } from "./Hooks/appHooks";
import { textAlign } from "@mui/system";

function App(props) {
  //* Current message that displays in textarea
  const [value, setValue] = useState("Hello World!");

  //* Your current message that you've just sent
  const [message, setMessage] = useState({});

  //* List of connected peers
  const [peers, setPeers] = useState([]);
  const [channel, setChannel] = useState("example_topic");
  const [channels, setChannels] = useChannels(echo);
  const [file, setFile] = useState(null);

  //* Web3 stuff
  const [ipfs, web3, id, username, setUsername, color] = useWeb3(
    setChannels,
    echo
  );

  //* Ethereum wallet
  const [account] = useName(web3);

  //BasicProfile
  const [profile, setProfile] = useState(props.profile);

  //* Color of your username that displays in chat

  //* callback when someone publishi in channel
  function echo(msg) {
    //* We have date here, but we don't use it now
    const d = new Date();
    let time = d.getTime();

    //* This is the way that we can read message from ipfs
    if (Buffer(msg.data).toString().length) {
      //* We are storing stringified JSON in message
      const message = JSON.parse(Buffer(msg.data).toString());
      if (message.type !== "file") {
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
        console.log(message.type, message.hash);
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
    }
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const type = file ? "file" : "text";
    //* Publich message to channel
    if (type === "file") {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      let hash;
      reader.onloadend = async () => {
        hash = await ipfs.add(Buffer(reader.result));
        console.log("converted");
        await ipfs.pubsub.publish(
          "example_topic",
          //* As I sad - stringified JSON
          JSON.stringify({
            username,
            value,
            color,
            channel,
            type,
            hash,
          })
        );
      };
    } else {
      await ipfs.pubsub.publish(
        "example_topic",
        //* As I sad - stringified JSON
        JSON.stringify({
          username,
          value,
          color,
          channel,
          type,
        })
      );
    }
  };

  const handleDrag = (ev) => {
    console.log("File(s) in drop zone");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  const handleDrop = (ev) => {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          let _file = ev.dataTransfer.items[i].getAsFile();
          console.log("FROM DROP", _file instanceof Blob);
          setFile(_file);
          console.log("... file[" + i + "].name = " + _file.name);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log(
          "... file[" + i + "].name = " + ev.dataTransfer.files[i].name
        );
      }
    }
  };

  console.log(props);

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
              currentChannel={channel}
              self={id}
              ipfs={ipfs}
              setChannel={setChannel}
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
              id={id}
              self={username}
              ipfs={ipfs}
              color={color}
              echo={echo}
              setChannels={setChannels}
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
                channel={channel}
                message={message}
                ipfs={ipfs}
                setPeers={setPeers}
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
              {props.haveAccount ? (
                <>
                  <p>Your Profile Name: {props.profile.name}</p>
                  <p>
                    Your Profile avatar:{" "}
                    <img alt="avatar" src={props.profile.avatar} />
                  </p>
                  <p>Your Profile description: {props.profile.description}</p>
                </>
              ) : (
                <>
                  <p> No Account connected</p>
                </>
              )}
              <EditProfile
                readProfile={props.readProfile}
                haveAccount={props.haveAccount}
                profile={props.profile}
              />
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
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  style={{ height: "20px" }}
                  type="text"
                  value={username}
                  onChange={handleChangeUsername}
                />
              </label>
              <br></br>
              Message:
              <input
                style={{ width: "75%", height: "30px" }}
                id="textfield"
                onChange={handleChange}
                value={value}
                type="text"
                onDrop={handleDrop}
                onDrag={handleDrag}
              />
              <button style={{ height: "30px" }}>Send message</button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
