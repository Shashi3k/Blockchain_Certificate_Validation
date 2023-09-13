import React, { useState } from "react";
import { create } from "ipfs-http-client";
const projectId="2VG2HRw74lI6t0i4pq0O6RHnofv"
const projectSecret="0a8b203144747ebec74d1f2fb19f79e5"
const auth = 'Basic '+Buffer.from(projectId+":"+projectSecret).toString('base64');


const App = () => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const [hash, setHash] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const ipfsClient = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      authorization: auth,
    });

    const result = await ipfsClient.add(file);
    setCid(result.cid);
    setHash(result.hash);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={onSubmitHandler}>Upload</button>
      <p>CID: {cid}</p>
      <p>Hash: {hash}</p>
    </div>
  );
};

export default App;
