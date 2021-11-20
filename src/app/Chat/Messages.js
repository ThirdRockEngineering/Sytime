import React, { useEffect, useState } from "react";

import { makeFileObject } from "../Utils/filemaker";
//* web3.storage stuff
import {
  storeWithProgress,
  fetchHistory,
} from "../../decent_network/web3Storage";

//* we only can upload files to web3.storage
//* this will convert .json to File

const Messages = ({
  channel,
  ipfs,
  message,
  peers,
  account,
  username,
  peer,
}) => {
  //* List of all messages
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      let history = [
        ...messages.filter((message) => message.channel === channel),
        (await fetchHistory()).filter((message) => message.channel === channel),
      ];
      if (Array.isArray(history[0])) {
        history = history[0];
      }
      setMessages(history);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let history = [
        ...messages.filter((message) => message.channel === channel),
        (await fetchHistory()).filter((message) => message.channel === channel),
      ];
      if (Array.isArray(history[0])) {
        history = history[0];
      }
      setMessages(history);
    })();
  }, [channel]);

  useEffect(() => {
    (async () => {
      console.log("messages", message.channel, channel);
      if (message.message && message.channel === channel) {
        setMessages([
          ...messages,
          {
            message: message.message,
            username: message.username,
            channel: message.channel,
            color: message.color,
            account: message.account,
            id: message.id,
            type: message.type === "file" ? "file" : "text",
            hash: message.hash ? message.hash : undefined,
          },
        ]);
        //* I know - it's bad sync all peers every time message is thrown
        //* It's just for now
        //* It will not display you on your end (idk why)

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
          return message.type !== "file" ? (
            <div key={key}>
              <span style={{ color: `#${message.color}` }}>
                {message.username}
              </span>
              : {message.message}
            </div>
          ) : (
            <div key={key}>
              <span style={{ color: `#${message.color}` }}>
                {message.username}
              </span>
              : {message.message}
              <img
                src={`https://ipfs.io/ipfs/${message.hash}`}
                alt="sending pic"
                style={{ maxHeight: "50px", maxWeight: "50px" }}
              />
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Messages;
