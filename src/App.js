import img from "./image.png";
import "./App.css";
import node from "./ipfs";
import React, { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState("Hello World!");
  const [ipfs, setIpfs] = useState(null);

  useEffect(() => {
    (async () => {
      const _ipfs = await node;
      setIpfs(await _ipfs);

      function echo(msg) {
        try {
          // console.log(msg.toString());
          // const data = new TextDecoder().decode(msg);
          console.log(Buffer(msg.data).toString());
          // console.log("not error", data);
          setValue(Buffer(msg.data).toString());
        } catch (err) {
          // setValue(msg.data);
          console.log("error", msg.data.toString());
        }
      }

      await _ipfs.pubsub.subscribe("example_topic", echo);
      await _ipfs.pubsub.publish("example_topic", "Hello world!");
    })();
  }, []);

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
