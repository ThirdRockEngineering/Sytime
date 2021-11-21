import React from "react";
import { Divider, Paper, InputBase, IconButton} from "@mui/material"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const TypeMessage = ({
  value,
  file,
  ipfs,
  username,
  color,
  channel,
  account,
  id,
  setUsername,
  setFile,
  setValue,
  profile,
}) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // const handleChangeUsername = (event) => {
  //   setUsername(event.target.value);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const type = file ? "file" : "text";
    //* Publich message to channel
    if (type === "file") {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      let hash;
      reader.onloadend = async () => {
        hash = await ipfs.add(Buffer(reader.result));
        console.log("converted", hash.path);
        await ipfs.pubsub.publish(
          "example_topic",
          //* As I sad - stringified JSON
          profile.name
            ? JSON.stringify({
                username: profile.name,
                value,
                color,
                channel,
                account: account,
                name: username,
                id,
                type,
                hash: hash.path,
              })
            : JSON.stringify({
                username: `Anonymous(${username})`,
                value,
                color,
                channel,
                account: account,
                name: username,
                id,
                type,
                hash: hash.path,
              })
        );
        setFile(null);
      };
    } else {
      await ipfs.pubsub.publish(
        "example_topic",
        //* As I sad - stringified JSON
        profile.name
          ? JSON.stringify({
              username: profile.name,
              value,
              account: account,
              name: username,
              id,
              color,
              channel,
              type,
            })
          : JSON.stringify({
              username: `Anonymous(${username})`,
              value,
              color,
              account: account,
              name: username,
              id,
              channel,
              type,
            })
      );
      setValue('')
    }
  };

  const handleDrag = (ev) => {
    console.log("File(s) in drop zone");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  const handleDrop = (ev) => {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          let _file = ev.dataTransfer.items[i].getAsFile();
          console.log("FROM DROP", _file instanceof Blob);
          setFile(_file);
          console.log("... file[" + i + "].name = " + _file.name);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log(
          "... file[" + i + "].name = " + ev.dataTransfer.files[i].name
        );
      }
    }
  };

  return (
    <>
    <Divider />

      <Paper component="form" onSubmit={handleSubmit} p={4}
      sx={{ p: '10px 20px', display: 'flex', alignItems: 'center'}}>

        <InputBase
          value={value}
          placeholder="Enter Message here"
          onChange={handleChange}
          type="text"
          onDrop={handleDrop}
          onDrag={handleDrag}
          multiline
          maxRows={10}
          fullWidth
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="submit" sx={{p:"5px"}}>
          <ArrowUpwardIcon />
        </IconButton>
      </Paper>
    </>
  );
};

export default TypeMessage;
