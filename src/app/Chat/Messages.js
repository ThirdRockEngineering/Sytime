import React from "react";

//* we only can upload files to web3.storage
//* this will convert .json to File

import { useMessages, useMessage } from "../Hooks/messagesHooks";

const Messages = ({ channel, ipfs, message, setPeers }) => {
  //* List of all messages
  const [messages, setMessages] = useMessages(channel);

  useMessage(message, ipfs, messages, setMessages, setPeers, channel);

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
