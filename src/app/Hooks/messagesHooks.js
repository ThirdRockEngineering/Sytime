import { useState, useEffect } from "react";
import { makeFileObject } from "../Utils/filemaker";
//* web3.storage stuff
import {
  storeWithProgress,
  fetchHistory,
} from "../../decent_network/web3Storage";

//* Updating local messages list every time message changes
export const useMessages = (channel) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      setMessages(
        (await fetchHistory()).filter((message) => message.channel === channel)
      );
    })();
  }, [channel]);

  return [messages, setMessages];
};

export const useMessage = (
  message,
  ipfs,
  messages,
  setMessages,
  setPeers,
  channel
) => {
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
};
