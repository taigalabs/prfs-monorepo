import { Web3Provider } from "ethers";

declare global {
  interface Window {
    ethereum: any,
    ethers: Web3Provider,
  }
}
