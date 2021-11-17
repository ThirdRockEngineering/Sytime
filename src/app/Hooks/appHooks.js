import { useState, useEffect } from "react";

//* node and _web3 is promises now, because we can't
//* await them in different file :(
//* check getWeb3.js and ipfs.js
import node from "../../decent_network/ipfs";
import _web3 from "../../decent_network/getWeb3";

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

export const useChannels = (echo) => {
  const [channels, setChannels] = useState([]);

  //* Subscribe to yourself
  useEffect(() => {
    (async () => {
      const ipfs = await node;
      const id = (await ipfs.id()).id;
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
  }, []);

  return [channels, setChannels];
};

export const useWeb3 = (setChannels, echo) => {
  const [ipfs, setIpfs] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [id, setId] = useState("");

  //* Await all promises
  useEffect(() => {
    (async () => {
      const _ipfs = await node;

      //* setting global state

      //* ipfs node
      setIpfs(await _ipfs);

      //* connection to wallet via web3
      setWeb3(await _web3);

      //* Your id
      setId((await _ipfs.id()).id);

      //* Subscribe your browser to topic
      await _ipfs.pubsub.subscribe("example_topic", echo);
      setChannels(await _ipfs.pubsub.ls());
    })();
  }, []);

  return [ipfs, web3, id];
};
