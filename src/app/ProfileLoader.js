import App from "./App";
import { useEffect, useState } from "react";
import { connect, fetchProfile } from "../ceramicProfile/profile";

function ProfileLoader(props) {
  const [profile, setProfile] = useState({
    name: "Anonymous",
    description: "",
    avatar:
      "https://ipfs.io/ipfs/QmZYHnYdmcTYZxAy2FE7LXQumub4Y36zKbUx96YRspWPD5",
  });
  const [haveAccount, setHaveAccount] = useState(false);

  useEffect(() => {
    (async () => {
      // const address = await connect()
      // if ( address ){
      //   const data = await fetchProfile(address)
      //   setProfile(data)
      //   setHaveAccount(true)
      // }
      await readProfile();
    })();
  }, []);
  console.log(props.web3);

  async function readProfile() {
    try {
      const address = await connect();
      if (address) {
        const data = await fetchProfile(address);
        if (data) {
          console.log("Data here", data);
          setProfile(data);
          setHaveAccount(true);
        }
      }
    } catch (err) {
      alert("Ethereum account not connected", err);
    }
  }

  return (
    <App
      account={props.account}
      profile={profile}
      haveAccount={haveAccount}
      readProfile={readProfile}
    />
  );
}

export default ProfileLoader;
