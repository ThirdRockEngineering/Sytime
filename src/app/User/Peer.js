import {useState, useEffect} from "react";
import { Button } from "@mui/material"
import { fetchProfile } from "../../ceramicProfile/profile";

const Peer = (props) => {
  const {
    peer,
    self,
    ipfs,
    color,
    setChannel,
    echo,
    id,
    account,
    channels,
    profile,
  } = props;

  const [name, setName] = useState('')

  useEffect(() => {
    (async () => {
      const peerData = await fetchProfile(peer.account)
      peerData ? (setName(peerData.name)) : (setName(peer.username))

    })();
  }, [peer])

  async function connectWithPeer() {
    //* Subscribe to another peer's channel
    await ipfs.pubsub.subscribe(peer.id, async (msg) => {
      if (Buffer(msg.data).toString().length) {
        //* Subscbibe to channel between only two peers
        const _channels = await ipfs.pubsub.ls();
        if (
          !_channels.includes(`${peer.account}-${account}`) &&
          !_channels.includes(`${account}-${peer.account}`)
        ) {
          console.log(_channels);
          await ipfs.pubsub.subscribe(`${peer.account}-${account}`, echo);
          const obj = {};
          obj[`${peer.account}-${account}`] = {
            peerName: peer.username,
            peerAcc: peer.account,
            name: `${peer.account}-${account}`,
          };
          setChannel(obj);
        }
        //* And immediately unsubscribe after new channel created
        await ipfs.pubsub.unsubscribe(peer.id);
        //* Update channel list
      }
    });

    //* Post a message to create a new channel for 2 peers
    await ipfs.pubsub.publish(
      peer.id,
      JSON.stringify({
        username: self,
        value: "wanna conect?",
        color,
        id,
        type: "text",
        account,
      })
    );
  }
  console.log(peer)
  return (
      <Button fullWidth onClick={connectWithPeer}>
        {name}
      </Button>
  );
};

export default Peer;
