import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

const getWeb3 = async () => {
  const web3 = new Web3(window.ethereum);
  if (web3.isReady) {
    return web3;
  } else {
    const provider=await detectEthereumProvider()
    return new Web3(provider);
  }
};

export default getWeb3;