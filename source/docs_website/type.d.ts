// import { Web3Provider } from "ethers";

import { Envs } from "./envs";

declare global {
  // interface Window {
  //   ethereum: any;
  //   ethers: Web3Provider;
  // }

  namespace NodeJS {
    interface ProcessEnv extends Envs {}
  }
}
