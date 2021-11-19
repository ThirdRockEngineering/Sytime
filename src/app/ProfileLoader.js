import App from "./App";
import { useEffect, useState } from "react";
import { connect, fetchProfile } from "../ceramicProfile/profile";

function ProfileLoader() {
  const [profile, setProfile] = useState({});
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
  console.log("profile loader", profile);
  console.log(profile);

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
      profile={profile}
      haveAccount={haveAccount}
      readProfile={readProfile}
    />
  );
}

export default ProfileLoader;
