"use client";

import React from "react";
import { ethers } from "ethers";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import styles from "./page.module.scss";
import { proveMembershipMock } from "@/prfs/mock";
import { proveMembership } from "@/prfs";
import Masthead from "@/components/masthead/Masthead";
// import getSigner from "@/fns/getSigner";
import { useAddress, useSigner } from "@thirdweb-dev/react";

const Home: React.FC = () => {
  console.log("Home()");

  const proverAddressMembershipMock = React.useCallback(() => {
    proveMembershipMock().then(() => {});
  }, []);

  const proverAddressMembership = React.useCallback(() => {
    // proveMembership(signer).then(() => { });
  }, []);

  return (
    <ThirdwebProvider activeChain="ethereum">
      <div className={styles.wrapper}>
        123
        <Masthead />
        <button onClick={proverAddressMembershipMock}>Prove Address Membership mock</button>
        <button onClick={proverAddressMembership}>Prove Address Membership</button>
      </div>
    </ThirdwebProvider>
  );
};

export default Home;

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
