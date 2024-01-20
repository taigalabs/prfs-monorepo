/* eslint-disable */

// import { MetaMaskInpageProvider } from "@taigalabs/prfs-web3-js/metamask/providers";

/*
 * Window type extension to support ethereum
 */
declare global {
  interface Window {
    // ethereum: unknown;
    // MetaMaskInpageProvider & {
    //   setProvider?: (provider: MetaMaskInpageProvider) => void;
    //   detected?: MetaMaskInpageProvider[];
    //   providers?: MetaMaskInpageProvider[];
    // };
  }
}

export type GetSnapsResponse = Record<string, Snap>;

export type Snap = {
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, unknown>;
};
