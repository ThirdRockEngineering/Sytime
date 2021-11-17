import img from "../public/image.png";
import "../public/CSS/App.css";
import Channel from "./Chat/Channel";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";

//* node and _web3 is promises now, because we can't
//* await them in different file :(
//* check getWeb3.js and ipfs.js
import node from "../decent_network/ipfs";
import _web3 from "../decent_network/getWeb3";

import { makeFileObject } from "./Utils/filemaker";
import React, { useEffect, useState } from "react";

import EditProfile from "./User/editProfile";
import Messages from "./Messages";
import Peers from "./Peers";
import Channels from "./Channels";

//* Hooks
import { useName, useChannels } from "./Hooks/appHooks";

function App(props) {
  //^ Promise Tracker Attempt

  const { promiseInProgress } = usePromiseTracker(node);
  //* Current message that displays in textarea
  const [value, setValue] = useState("Hello World!");

  //* Your current message that you've just sent
  const [message, setMessage] = useState({});

  //* ipfs node
  const [ipfs, setIpfs] = useState(null);

  //* connection to wallet via web3
  const [web3, setWeb3] = useState(null);

  //* List of connected peers
  const [peers, setPeers] = useState([]);

  //* Your id
  const [id, setId] = useState("");
  const [channel, setChannel] = useState("example_topic");
  const [channels, setChannels] = useChannels(ipfs, id, echo);
  //* Ethereum wallet
  const [account, username, setUsername] = useName(web3);

  //BasicProfile
  const [profile, setProfile] = useState(props.profile);

  //* Color of your username that displays in chat
  const [color, setColor] = useState(
    //* Your color in channels
    Math.floor(Math.random() * 16777215).toString(16)
  );

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

  //* Await all promises
  useEffect(() => {
    (async () => {
      const _ipfs = await node;

      //* setting global state
      setIpfs(await _ipfs);
      setWeb3(await _web3);
      setId((await _ipfs.id()).id);

      //* Subscribe your browser to topic
      await _ipfs.pubsub.subscribe("example_topic", echo);
      setChannels(await _ipfs.pubsub.ls());
    })();
  }, []);

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
          <input type="text" value={username} onChange={handleChangeUsername} />
        </label>
        <input
          style={{ width: "75%" }}
          id="textfield"
          onChange={handleChange}
          value={value}
          type="text"
        />
        <button>Send message</button>
      </form>
    </div>
  );
}

export default App;
