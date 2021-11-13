import * as IPFS from "ipfs-core";

const main = async () => {
  const ipfs = await IPFS.create({
    repo: "ok" + Math.random(), // random so we get a new peerid every time, useful for testing
    config: {
      Bootstrap: [
        "/dns6/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt",
        "/dns4/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt",
      ],
      Addresses: {
        Swarm: [
          "/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star",
          "/dns6/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star",
        ],
      },
    },
  });
  return ipfs;
};

function repo() {
  return "chat-test/" + Math.random();
}

export default main();
