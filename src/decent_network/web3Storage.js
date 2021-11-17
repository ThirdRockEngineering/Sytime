//* I had an issue w webpack here :)
//* https://github.com/web3-storage/web3.storage/issues/312
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

function getAccessToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDYxMDhFNGQwMkRBNTk3NzQ0RUM4M0JiMUY2NDIyODA3NEE1MjJmNEUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzcwOTM4OTk2NjYsIm5hbWUiOiJTeXRpbWUifQ.YCCi50dr2kv26AK4ZNo52eHDFTPaXSd6u9Q9r1rRT0k";
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

const client = makeStorageClient();

export async function storeWithProgress(files) {
  // show the root cid as soon as it's ready
  const onRootCidReady = (cid) => {
    console.log("uploading files with cid:", cid);
  };

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
  let uploaded = 0;

  const onStoredChunk = (size) => {
    uploaded += size;
    const pct = totalSize / uploaded;
    console.log(`Uploading... ${pct.toFixed(2)}% complete`);
  };

  // makeStorageClient returns an authorized Web3.Storage client instance

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onStoredChunk });
}

export default client;
