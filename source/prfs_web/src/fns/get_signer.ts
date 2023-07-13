import { ethers } from "ethers";

export default async function getSigner() {
  if (window.ethereum == null) {
    console.log("MetaMask not installed");
  } else {
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    console.log("signer", signer);
    return signer;
  }
};
