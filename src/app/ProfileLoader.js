import App from "./App";
import { useEffect, useState } from "react";
import { connect, fetchProfile } from "../ceramicProfile/profile";

function ProfileLoader(props) {
  const [profile, setProfile] = useState({
    name: "Anonymous",
    description: "",
    avatar:
      "https://ipfs.io/ipfs/QmZYHnYdmcTYZxAy2FE7LXQumub4Y36zKbUx96YRspWPD5",
    channels: {},
  });
  const [haveAccount, setHaveAccount] = useState(false);

  useEffect(() => {
    (async () => {
      await readProfile();
    })();
  }, []);


  async function readProfile() {
    try {
      const address = await connect();
      if (address) {
        const data = await fetchProfile(address);
        if (data) {
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
      setProfile={setProfile}
    />
  );
}

export default ProfileLoader;
