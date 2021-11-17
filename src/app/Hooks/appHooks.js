import { useState, useEffect } from "react";

export const useName = (web3) => {
  const [account, setAccount] = useState(
    "You are not connected to your ethereum wallet"
  );
  const [username, setUsername] = useState("");
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

  return [account, username, setUsername];
};

export const useChannels = (ipfs, id, echo) => {
  const [channels, setChannels] = useState([]);

  //* Subscribe to yourself
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

  return [channels, setChannels];
};
