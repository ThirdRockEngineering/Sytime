import img from "../public/image.png";
import "../public/CSS/App.css";
import React, { useEffect, useState } from "react";

import { trackPromise, usePromiseTracker } from "react-promise-tracker";

import { makeFileObject } from "./Utils/filemaker";

//* Components
import EditProfile from "./User/editProfile";
import Messages from "./Chat/Messages";
import Peers from "./Chat/Peers";
import Channels from "./Chat/Channels";

//* Hooks
import { useName, useChannels, useWeb3 } from "./Hooks/appHooks";

function App(props) {
  //* Current message that displays in textarea
  const [value, setValue] = useState("Hello World!");

  //* Your current message that you've just sent
  const [message, setMessage] = useState({});

  //* List of connected peers
  const [peers, setPeers] = useState([]);
  const [channel, setChannel] = useState("example_topic");
  const [channels, setChannels] = useChannels(echo);

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
      //* Change message from state
      setMessage({
        username: message.username,
        message: message.value,
        color: message.color,
        channel: message.channel,
        time,
      });
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

    //* Publich message to channel
    await ipfs.pubsub.publish(
      "example_topic",
      //* As I sad - stringified JSON
      JSON.stringify({
        username,
        value,
        color,
        channel,
      })
    );
  };

  console.log(props);

  return (
    <div className="App">
      <img src={img} className="App-logo" alt="logo" />
      <p>
        Simple test <code>ipfs-pubsub</code> with changing doc.
      </p>
      <p>Your wallet: {account}</p>
      <p>Your peer id: {id}</p>
      {props.haveAccount ? (
        <>
          <p>Your Profile Name: {props.profile.name}</p>
          <p>
            Your Profile avatar: <img alt="avatar" src={props.profile.avatar} />
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
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Messages
          channel={channel}
          message={message}
          ipfs={ipfs}
          setPeers={setPeers}
        />
        <Peers
          peers={peers}
          id={id}
          self={username}
          ipfs={ipfs}
          color={color}
          echo={echo}
          setChannels={setChannels}
        />
        <Channels
          channels={channels}
          currentChannel={channel}
          self={id}
          ipfs={ipfs}
          setChannel={setChannel}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            style={{ height: "30px" }}
            type="text"
            value={username}
            onChange={handleChangeUsername}
          />
        </label>
        <input
          style={{ width: "75%", height: "30px" }}
          id="textfield"
          onChange={handleChange}
          value={value}
          type="text"
        />
        <button style={{ height: "30px" }}>Send message</button>
      </form>
    </div>
  );
}

export default App;
