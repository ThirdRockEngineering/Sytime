import React, { useState, useEffect } from "react";

const TypeMessage = ({
  value,
  file,
  ipfs,
  username,
  color,
  channel,
  setUsername,
  setFile,
  setValue,
  profile,
}) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log();
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
                type,
                hash: hash.path,
              })
            : JSON.stringify({
                username: `Anonymous(${username})`,
                value,
                color,
                channel,
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
              color,
              channel,
              type,
            })
          : JSON.stringify({
              username: `Anonymous(${username})`,
              value,
              color,
              channel,
              type,
            })
      );
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
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          style={{ height: "20px" }}
          type="text"
          value={username}
          onChange={handleChangeUsername}
        />
      </label>
      <br></br>
      Message:
      <input
        style={{ width: "75%", height: "30px" }}
        id="textfield"
        onChange={handleChange}
        value={value}
        type="text"
        onDrop={handleDrop}
        onDrag={handleDrag}
      />
      <button style={{ height: "30px" }}>Send message</button>
    </form>
  );
};

export default TypeMessage;
