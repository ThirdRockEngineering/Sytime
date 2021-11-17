import React, { useEffect, useState } from "react";

import { makeFileObject } from "../Utils/filemaker";
//* web3.storage stuff
import {
  storeWithProgress,
  fetchHistory,
} from "../../decent_network/web3Storage";

//* we only can upload files to web3.storage
//* this will convert .json to File

const Messages = ({ channel, ipfs, message, setPeers }) => {
  //* List of all messages
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      console.log("changes channel", await fetchHistory());
      setMessages(
        (await fetchHistory()).filter((message) => message.channel === channel)
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log("changes channel", await fetchHistory());
      setMessages(
        (await fetchHistory()).filter((message) => message.channel === channel)
      );
    })();
  }, [channel]);

  useEffect(() => {
    (async () => {
      if (message.message && message.channel === channel) {
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

        //* Upload history to web3.storage
        const _messages = await fetchHistory();
        _messages.push(message);
        const file = makeFileObject(_messages);
        await storeWithProgress([file]);
      }
    })();
  }, [message]);

  return (
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
  );
};

export default Messages;
