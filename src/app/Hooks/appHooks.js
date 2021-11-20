import { useState, useEffect } from "react";

//* node and _web3 is promises now, because we can't
//* await them in different file :(
//* check getWeb3.js and ipfs.js
import node from "../../decent_network/ipfs";
import getWeb3 from "../../decent_network/getWeb3";

export const useChannels = (echo, account, setChannel, profile) => {
  const [channels, setChannels] = useState(profile.channels);

  useEffect(() => {
    setChannels({ ...channels, ...profile.channels });
  }, [profile]);
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
            await ipfs.pubsub.subscribe(`${account}-${message.account}`, echo);
            //* ls method will list all channel you are connected to
            const obj = {};
            obj[`${account}-${message.account}`] = {
              peerName: message.username,
              peerAcc: message.account,
              name: `${account}-${message.account}`,
            };
            setChannel(obj);
          }
        });
      }
    })();
  }, []);

  return [channels, setChannels];
};

export const useWeb3 = (setChannels, echo, account, channels) => {
  const [ipfs, setIpfs] = useState(null);
  const [id, setId] = useState("");
  const [color, setColor] = useState(
    Math.floor(Math.random() * 16777215).toString(16)
  );

  //* Await all promises
  useEffect(() => {
    (async () => {
      const web3 = await getWeb3;
      const _ipfs = await node;
      const acc = (await web3.eth.getAccounts())[0];
      let newPeer = "new peer";
      //* ipfs node
      setIpfs(_ipfs);
      if (acc) {
        newPeer = acc.slice(0, 4) + "..." + acc.slice(-4);
      }
      //* connection to wallet via web3

      //* Your id

      const _id = (await _ipfs.id()).id;
      setId(_id);
      //* Subscribe your browser to topic
      await _ipfs.pubsub.subscribe("example_topic", echo);
      setTimeout(async () => {
        await _ipfs.pubsub.publish(
          "example_topic",
          JSON.stringify({
            username: newPeer,
            value: "is joined",
            color,
            id: _id,
            channel: "example_topic",
            type: "text",
            account: account,
          })
        );
      }, 3000);
    })();
    const obj = {};
    obj[`${account}`] = {
      peerName: "example_topic",
      peerAcc: account,
      name: "example_topic",
    };
    if (!Object.keys(channels).includes(account)) {
      setChannels({ ...channels, ...obj });
    }
  }, []);

  return [ipfs, id, color];
};
