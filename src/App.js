import img from "./image.png";
import "./App.css";
import node from "./ipfs";
import Web3 from "web3";
import React, { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState("Hello World!");
  const [ipfs, setIpfs] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(
    "You are not connected to your ethereum wallet"
  );

  useEffect(() => {
    (async () => {
      const _ipfs = await node;
      setIpfs(await _ipfs);

      // https://ethereum.stackexchange.com/questions/67145/how-to-connect-web3-with-metamask
      if (window.ethereum) {
        const _web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(_web3);
        } catch (error) {
          console.error(error);
        }
      } else if (window.web3) {
        const _web3 = window.web3;
        console.log("Injected web3 detected.");
        setWeb3(_web3);
      } else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const _web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        setWeb3(_web3);
      }

      function echo(msg) {
        setValue(Buffer(msg.data).toString());
      }

      await _ipfs.pubsub.subscribe("example_topic", echo);
      await _ipfs.pubsub.publish("example_topic", "Hello world!");
    })();
  }, []);

  useEffect(() => {
    console.log("YEEASS");
    (async () => {
      if (web3) {
        setAccount((await web3.eth.getAccounts())[0]);
      }
    })();
  }, [web3]);

  const onChange = async (event) => {
    await ipfs.pubsub.publish("example_topic", event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={img} className="App-logo" alt="logo" />
        <p>
          Simple test <code>ipfs-pubsub</code> with changing doc.
        </p>
        <p>{account}</p>
        <textarea
          style={{ width: "100%", height: "500px" }}
          id="textfield"
          onChange={onChange}
          value={value}
        ></textarea>
      </header>
    </div>
  );
}

export default App;
