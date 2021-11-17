import img from "../public/image.png";
import "../public/CSS/App.css";
import Peer from "./User/Peer";
import Channel from "./Chat/Channel";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";

//* node and _web3 is promises now, because we can't
//* await them in different file :(
//* check getWeb3.js and ipfs.js
import node from "../decent_network/ipfs";
import _web3 from "../decent_network/getWeb3";
import web3StorageClient from "../decent_network/web3Storage";
import { makeFileObject } from "./Utils/filemaker";
import React, { useEffect, useState } from "react";

import EditProfile from "./User/editProfile";

async function storeWithProgress(files) {
  // show the root cid as soon as it's ready
  const onRootCidReady = (cid) => {
    console.log("uploading files with cid:", cid);
  };

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
  let uploaded = 0;

  const onStoredChunk = (size) => {
    uploaded += size;
    const pct = totalSize / uploaded;
    console.log(`Uploading... ${pct.toFixed(2)}% complete`);
  };

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = web3StorageClient;

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onStoredChunk });
}

function App(props) {
  //^ Promise Tracker Attempt

  const { promiseInProgress } = usePromiseTracker(node);
  //* Current message that displays in textarea
  const [value, setValue] = useState("Hello World!");

  //* List of all messages
  const [messages, setMessages] = useState([]);

  //* Your current message that you've just sent
  const [message, setMessage] = useState({});

  //* ipfs node
  const [ipfs, setIpfs] = useState(
    null
    // (() => {
    //   (async () => await node)();
    // })()
  );

  const [storageClient, setStorageClient] = useState(web3StorageClient);

  //* connection to wallet via web3
  const [web3, setWeb3] = useState(null);
  const [username, setUsername] = useState("");

  //* List of connected peers
  const [peers, setPeers] = useState([]);

  //* Your id
  const [id, setId] = useState("");
  const [channel, setChannel] = useState("example_topic");
  const [channels, setChannels] = useState([]);
  //* Ethereum wallet
  const [account, setAccount] = useState(
    "You are not connected to your ethereum wallet"
  );

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
  useEffect(() => {
    (async () => {
      if (ipfs && id.length) {
        await ipfs.pubsub.subscribe(`${id}`, async (msg) => {
          if (Buffer(msg.data).toString().length) {
            //* We are storing stringified JSON in message
            const message = JSON.parse(Buffer(msg.data).toString());
            //* Change message from state
            await ipfs.pubsub.subscribe(`${id}-${message.id}`, echo);
            setChannels(await ipfs.pubsub.ls());
          }
        });
        //* ls method will list all channel you are connected to
        setChannels(await ipfs.pubsub.ls());
      }
    })();
  }, [ipfs, id]);
  //* Setting up Ethereum wallet
  useEffect(() => {
    (async () => {
      if (web3) {
        const acc = (await web3.eth.getAccounts())[0];
        if (acc) {
          setAccount(acc);
          //* Make it shorter
          setUsername(acc.slice(0, 4) + "..." + acc.slice(-4));
        }
      }
    })();
  }, [web3]);

  //* Updating local messages list every time message changes
  useEffect(() => {
    (async () => {
      if (message.message) {
        setMessages([
          ...messages,
          {
            message: message.message,
            username: message.username,
            channel: message.channel,
            color: message.color,
          },
        ]);
        //* I know - it's bad sync all peers every time message is thrown
        //* It's just for now

        //* It will not display you on your end (idk why)
        setPeers(await ipfs.pubsub.peers("example_topic"));
      }
    })();
  }, [message]);

  useEffect(() => {
    (async () => {
      if (messages.length) {
        // const fr = new FileReader();
        const files = makeFileObject(messages);
        const cid = await storeWithProgress([files]);
        const res = await web3StorageClient.get(cid);
        console.log(res);
        // const _files = await res.files();
        // for (const file of _files) {
        //   console.log(`${file.cid} -- ${file.path} -- ${file.size}`);
        // }
        // console.log(history);
        // console.log(fr.readAsText(history));
      }
    })();
  }, [messages]);

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
      <EditProfile readProfile={props.readProfile} />
      {/* <h1>{me}</h1> */}
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h3>Messages</h3>
          <ul>
            {messages
              .filter((message) => message.channel === channel)
              .map((message, key) => {
                return (
                  <div key={key}>
                    <span style={{ color: `#${message.color}` }}>
                      {message.username}
                    </span>
                    : {message.message}
                  </div>
                );
              })}
          </ul>
        </div>
        <div>
          <h3>Peers</h3>
          <ul>
            {peers.map((peer, key) => {
              return (
                <div key={key}>
                  <Peer
                    peer={peer}
                    id={id}
                    self={username}
                    ipfs={ipfs}
                    color={color}
                    echo={echo}
                    setChannels={setChannels}
                  />
                </div>
              );
            })}
          </ul>
        </div>
        <div>
          <h3>Channels</h3>
          <ul>
            {channels.map((_channel, key) => {
              return (
                <div key={key}>
                  <Channel
                    channel={_channel}
                    currentChannel={channel}
                    self={id}
                    ipfs={ipfs}
                    setChannel={setChannel}
                  />
                </div>
              );
            })}
          </ul>
        </div>
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
