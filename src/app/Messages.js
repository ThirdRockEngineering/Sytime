import React, { useState, useEffect } from "react";
import web3StorageClient, {
  storeWithProgress,
} from "../decent_network/web3Storage";
const Messages = ({ channel, ipfs, message, setPeers }) => {
  //* List of all messages
  const [messages, setMessages] = useState([]);
  const [storageClient, setStorageClient] = useState(web3StorageClient);
  //* Your current message that you've just sent

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

  // useEffect(() => {
  //   (async () => {
  //     if (messages.length) {
  //       // const fr = new FileReader();
  //       const files = makeFileObject(messages);
  //       const cid = await storeWithProgress([files]);
  //       const res = await web3StorageClient.get(cid);
  //       console.log(res);
  //       // const _files = await res.files();
  //       // for (const file of _files) {
  //       //   console.log(`${file.cid} -- ${file.path} -- ${file.size}`);
  //       // }
  //       // console.log(history);
  //       // console.log(fr.readAsText(history));
  //     }
  //   })();
  // }, [messages]);

  return (
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
  );
};

export default Messages;
