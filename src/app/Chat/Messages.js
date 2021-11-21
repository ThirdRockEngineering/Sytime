import React, { useEffect, useState } from "react";

import { makeFileObject } from "../Utils/filemaker";
//* web3.storage stuff
import {
  storeWithProgress,
  fetchHistory,
} from "../../decent_network/web3Storage";

import { Box, Typography, Paper, Grid, Avatar, Divider } from "@mui/material";
import defaultUser from "../../public/defaultUser.jpeg"
import node from "../../decent_network/ipfs";

//* we only can upload files to web3.storage
//* this will convert .json to File

const Messages = ({
  channel,
  message,
  color,
  peers,
  echo,
  account,
  username,
  profile,
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
      const ipfs = await node;
      if (!(await ipfs.pubsub.ls()).includes("example_topic")) {
        await ipfs.pubsub.subscribe("example_topic", echo);
      }
      await ipfs.pubsub.publish(
        "example_topic",
        JSON.stringify({
          username,
          value: "is joined",
          color,
          id: peer.id,
          channel: "example_topic",
          type: "text",
          account: account,
          profile,
        })
      );
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
            profile: message.profile,
            type: message.type === "file" ? "file" : "text",
            hash: message.hash ? message.hash : undefined,
          },
        ]);
        //* I know - it's bad sync all peers every time message is thrown
        //* It's just for now
        //* It will not display you on your end (idk why)

        //* Upload history to web3.storage
        const _messages = [
          ...messages,
          {
            message: message.message,
            username: message.username,
            channel: message.channel,
            profile: message.profile,
            color: message.color,
            account: message.account,
            id: message.id,
            type: message.type === "file" ? "file" : "text",
            hash: message.hash ? message.hash : undefined,
          },
        ];
        const fetching = await fetchHistory();
        if (fetching.length + 1 > _messages.length) {
          const file = makeFileObject([
            ...fetching,
            {
              message: message.message,
              username: message.username,
              channel: message.channel,
              profile: message.profile,
              color: message.color,
              account: message.account,
              id: message.id,
              type: message.type === "file" ? "file" : "text",
              hash: message.hash ? message.hash : undefined,
            },
          ]);
          await storeWithProgress([file]);
        } else {
          const file = makeFileObject(_messages);
          await storeWithProgress([file]);
        }
      }
    })();
  }, [message]);
  console.log('messages', messages)
  return (
    <>
      <Box
        className="Messages"
        p={2}
        sx={{
          height:"100%",
          width:"95%"
        }}>
        {messages.map((message, key)=> {
          const timeStamp = new Date(message.time)
          if(message.message === 'is joined'){
            return (
            <>
              <Grid container key={key} p={2}>
                <Grid item xs={12}>
                  <Typography fontWeight="bold" sx={{
                    color: `#${message.color}`
                  }}>
                    {`${message.username} has connected!`}
                  </Typography>
                </Grid>
              </Grid>
              <Divider />
              </>
            )
          }
          else return (
            <>
            <Grid container key={key} p={2}>
              <Grid item xs={1} className="Avatar" alignContent="center">
                <Avatar alt="defaultUser" src={defaultUser} sx={{
                  height:"50px",
                  width:"50px"
                }} />
              </Grid>
              <Grid xs={11} item container className="Message" flexDirection="column">
                <Grid item className="username">
                  <Typography fontWeight="bold" sx={{
                    color: `#${message.color}`
                  }}>
                    {message.username}
                  </Typography>
                    {/* <Typography fontSize="smaller">{timeStamp.toString()}</Typography> */}
                </Grid>
                {message.type ==="file" ? (
                <Grid item className="picMessage" p={1}>
                   <img
                      src={`https://ipfs.io/ipfs/${message.hash}`}
                      alt="sending pic"
                      style={{ maxHeight: "250px", width: "auto" }} />
                  </Grid>) : (<></>)}
                <Grid item className="textmessage">
                  <Typography variant="body2" p={1}>
                    {message.message}
                  </Typography>
                </Grid>

              </Grid>
            </Grid>
            {key !== message.length ? (
                <Divider />
              ) : (<></>)}
            </>

          )

        })}
      </Box>
    </>



    // <div>
    //   <h3>Messages</h3>
    //   <ul>
    //     {messages.map((message, key) => {
    //       return message.type !== "file" ? (
    //         <div key={key}>
    //           <span style={{ color: `#${message.color}` }}>
    //             {message.username}
    //           </span>
    //           : {message.message}
    //         </div>
    //       ) : (
    //         <div key={key}>
    //           <span style={{ color: `#${message.color}` }}>
    //             {message.username}
    //           </span>
    //           : {message.message}
    //           <img
    //             src={`https://ipfs.io/ipfs/${message.hash}`}
    //             alt="sending pic"
    //             style={{ maxHeight: "50px", maxWeight: "50px" }}
    //           />
    //         </div>
    //       );
    //     })}
    //   </ul>
    // </div>
  );
};

export default Messages;
