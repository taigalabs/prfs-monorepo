"use client";

import React from "react";
import { ethers } from "ethers";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import styles from './page.module.css';
import { proveMembershipMock } from "@/prfs/mock";
import { proveMembership } from "@/prfs";
import Masthead from '@/components/Masthead/Masthead';
import getSigner from '@/fns/get_signer';

export default function Home() {
  console.log("Home()");

  let [account, setAccount] = React.useState<ethers.JsonRpcSigner>();
  React.useEffect(() => {
    getSigner().then();
  }, [setAccount]);

  const proverAddressMembershipMock = React.useCallback(() => {
    proveMembershipMock().then(() => { });
  }, []);

  const proverAddressMembership = React.useCallback(() => {
    proveMembership(account).then(() => { });
  }, [account]);

  return (
    <ThirdwebProvider activeChain="ethereum">
      <div>
        <Masthead />
        <button onClick={proverAddressMembershipMock}>Prove Address Membership mock</button>
        <button onClick={proverAddressMembership}>Prove Address Membership</button>
      </div>
    </ThirdwebProvider>
  );
}

// function getSiblingIdx(idx: number): number {
//   if (idx % 2 == 0) {
//     return idx + 1;
//   } else {
//     return idx - 1;
//   }
// }

// function getParentIdx(idx: number): number {
//   return idx / 2;
// }

// export interface NodePos {
//   posW: number;
//   posH: number;
// }
