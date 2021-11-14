import img from "./image.png";
import "./App.css";
import node from "./ipfs";
import _web3 from "./getWeb3";
import React, { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState("Hello World!");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({});
  const [ipfs, setIpfs] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [username, setUsername] = useState("");
  const [peers, setPeers] = useState([]);
  const [account, setAccount] = useState(
    "You are not connected to your ethereum wallet"
  );
  const [color, setColor] = useState(
    Math.floor(Math.random() * 16777215).toString(16)
  );

  useEffect(() => {
    (async () => {
      const _ipfs = await node;
      setIpfs(await _ipfs);
      setWeb3(await _web3);

      async function echo(msg) {
        const d = new Date();
        let time = d.getTime();
        if (Buffer(msg.data).toString().length) {
          const message = JSON.parse(Buffer(msg.data).toString());
          setMessage({
            username: message.username,
            message: message.value,
            color: message.color,
            time,
          });
        }
        setPeers([...peers, await _ipfs.pubsub.peers("example_topic")]);
      }

      await _ipfs.pubsub.subscribe("example_topic", echo);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (web3) {
        setAccount((await web3.eth.getAccounts())[0]);
        setUsername((await web3.eth.getAccounts())[0]);
      }
    })();
  }, [web3]);

  useEffect(() => {
    (async () => {
      if (message.message) {
        setMessages([
          ...messages,
          {
            message: message.message,
            username: message.username,
            color: message.color,
          },
        ]);
      }
    })();
  }, [message]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setMessages([...messages, value]);
    await ipfs.pubsub.publish(
      "example_topic",
      JSON.stringify({ username, value, color })
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={img} className="App-logo" alt="logo" />
        <p>
          Simple test <code>ipfs-pubsub</code> with changing doc.
        </p>
        <p>Your wallet: {account}</p>

        <div style={{ display: "flex" }}>
          <div>
            <h3>Messages</h3>
            <ul>
              {messages.map((message, key) => {
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
                  <div key={key} style={{ fontSize: "15px" }}>
                    {peer}
                  </div>
                );
              })}
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={username}
              onChange={handleChangeUsername}
            />
          </label>
          <textarea
            style={{ width: "100%", height: "500px" }}
            id="textfield"
            onChange={handleChange}
            value={value}
          ></textarea>
          <button>Send message</button>
        </form>
      </header>
    </div>
  );
}

export default App;
