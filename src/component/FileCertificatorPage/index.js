import { useEffect, useState } from 'react'
import { create as ipfsHttpClient } from "ipfs-http-client";
import getWeb3 from '../../utils/getWeb3';
import Authenticity from "../../contracts/Authenticity.json"
import { Button } from '@mui/material';
const projectId = "2VG2HRw74lI6t0i4pq0O6RHnofv"
const projectSecretKey = "0a8b203144747ebec74d1f2fb19f79e5"
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);


function FileCertifyPage() {
    const [images, setImages] = useState([])
    const [web3, setWeb3] = useState(null)
    const [contract, setContract]= useState(null)
    const [accounts, setAccounts] = useState([])
    const [currAdd, setCurrAdd] = useState(null)
    const [recep, setRecep] = useState('')
  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization
    }
  })

  useEffect(()=>{
    componentDidMount()
  },[])

const handleSubmit=(event)=>{
    event.preventDefault()
    console.log(recep)
}

  async function componentDidMount(){
    try{
        console.log("fgdh")
        const web3 = await getWeb3();
        console.log("sgdg")

        const accounts = await web3.eth.getAccounts();
        console.log("verify page",accounts[0])
        setCurrAdd(accounts[0])

        const netId = await web3.eth.net.getId()
        const deployedNetwork = Authenticity.networks[netId]
        const instance = new web3.eth.Contract(
            Authenticity.abi,
            deployedNetwork && deployedNetwork.address
        );

        setContract(instance)
        console.log(instance)
        setWeb3(web3)
        setAccounts(accounts)
    }
    catch(error){
        console.error("Web3 error",error)
        setWeb3(null)
        return (
            <h1>Connection error</h1>
        )
    }
  }

  // const sendToRecipient = () =>{
  //   return (
  //     <p>
  //       <form onSubmit={handleSubmit}>
  //         <label>
  //           Enter the recipient Wallet address:
  //           <input type='text' value={recep} onChange={(e)=>setRecep(e.target.value)} />
  //         </label>
  //         <button type='submit' onClick={handleSubmit}>Send</button>
  //       </form>
  //     </p>
  //   )
  // }

  
  
  // const renderCertifyBtn = () =>{
  //   if(recep==''){
  //     return null
  //   }
  //   return(
  //     <div>
  //       <Button color='success' onClick={
  //         ()=>certifyFile()
  //       }
  //       disabled={recep==""}>
  //         Certify File
  //       </Button>
  //     </div>
  //   )
  // }

  const certifyFile = async()=>{
    await contract.methods.certifyFile(125,"fileHash",recep).send({from: accounts[0]})
    window.alert("File sent to address"+ recep);
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = (form[0]).files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }

    const file = files[0];
    // upload files
    const result = await ipfs.add(file);
    const url="https://certificate3k.infura-ipfs.io/ipfs/" + result.path
    console.log(url)

    setImages([
        ...images,
        {
          cid: result.cid,
          path: result.path,
        },
      ]);
      console.log(images)
      
  
      form.reset();
    };

    return (
        <div className="App">
          
          {ipfs && (
            <>
              <h3>Upload file to IPFS</h3>
              <form onSubmit={onSubmitHandler}>
                <input type="file" name="file" />
                <button type="submit">Upload file</button>
              </form>
            </>
          )}
          <div>
            {images.map((image, index) => (
              <div>
              <img
                alt={`Uploaded #${index + 1}`}
                src={"https://certificate3k.infura-ipfs.io/ipfs/" + image.path}
                style={{ maxWidth: "400px", margin: "15px" }}
                key={image.cid.toString() + index}
              />
              <div key={image.cid.toString() + index+1}>
                  the hash code generated was {image.path}
              </div>
              <div>
              <p>
        <form onSubmit={handleSubmit}>
          <label>
            Enter the recipient Wallet address:
            <input type='text' value={recep} onChange={(e)=>setRecep(e.target.value)} />
          </label>
          <button type='submit' onClick={handleSubmit}>Send</button>
        </form>
      </p>
              </div>
              <div>
              <Button color='success' onClick={
          ()=>certifyFile()
        }
        disabled={recep==""}>
          Certify File
        </Button>
              </div>
              </div>
            ))}
          </div>
          
        </div>
      )

}

export default FileCertifyPage