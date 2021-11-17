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

  async function readProfile() {
    const address = await connect();
    if (address) {
      const data = await fetchProfile(address);
      if (data) {
        setProfile(data);
        setHaveAccount(true);
      }
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
