"use client";

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";
import { proveMembershipMock } from "@/prfs/mock";
import { proveMembership } from "@/prfs";
// import { MetaMaskInpageProvider } from "@metamask/providers";
// import { PRFS_GEN_ENDPOINT } from "@/config/index";
// import detectEthereumProvider from "@metamask/detect-provider";

const TREE_DEPTH: number = 32;

export default function Home() {
  console.log("Home()");

  let [account, setAccount] = React.useState<ethers.JsonRpcSigner>();
  React.useEffect(() => {
    console.log("Initializing app");

    let fn = async () => {
      if (window.ethereum == null) {
        console.log("MetaMask not installed");
      } else {
        let provider = new ethers.BrowserProvider(window.ethereum);
        let signer = await provider.getSigner();
        console.log("signer", signer);
        setAccount(signer);
      }
    };

    fn().then(_res => {});
  }, [setAccount]);

  const proverAddressMembershipMock = React.useCallback(() => {
    proveMembershipMock().then(() => {});
  }, []);

  const proverAddressMembership = React.useCallback(() => {
    proveMembership(account).then(() => {});
  }, [account]);

  return (
    <div>
      <button onClick={proverAddressMembershipMock}>Prove Address Membership mock</button>
      <button onClick={proverAddressMembership}>Prove Address Membership</button>
    </div>
  );
}

// const Generate: React.FC<any> = () => {
//   const [proof, setProof] = React.useState("");
//   const [proofTypes, setProofTypes] = React.useState([]);

//   React.useEffect(() => {
//     console.log("Fetch proof types");
//     // setProofTypes([]);
//   }, [setProofTypes]);

//   const handleClickGenProof = React.useCallback(() => {
//     fetchData(setProof).then((_) => { });
//   }, [setProof]);

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.proofType}>
//         <div>
//           Proof types
//         </div>
//         <ul className={styles.desc}>
//           {
//             proofTypes.map((_pt) => {
//               return <div>proof type</div>
//             })
//           }
//         </ul>
//       </div>
//       <div className={styles.genProofLabel}>Generate proof</div>
//       <button onClick={handleClickGenProof}>Generate proof</button>
//       <div className={styles.proofValue}>{proof}</div>
//     </div>
//   );
// };

// export default Generate;

// function getMerklePath(leafIdx: number, treeDepth: number): NodePos[] {
//   let currIdx = leafIdx;
//   let merklePath: NodePos[] = [];
//   for (let h = 0; h < treeDepth - 1; h += 1) {
//     let parentIdx = getParentIdx(currIdx);
//     let parentSiblingIdx = getSiblingIdx(parentIdx);

//     merklePath.push({
//       posW: parentSiblingIdx,
//       posH: h
//     });
//     currIdx = parentIdx;
//   }

//   return merklePath;
// }

function getSiblingIdx(idx: number): number {
  if (idx % 2 == 0) {
    return idx + 1;
  } else {
    return idx - 1;
  }
}

function getParentIdx(idx: number): number {
  return idx / 2;
}

export interface NodePos {
  posW: number;
  posH: number;
}
