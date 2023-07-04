"use client";

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";
import { proveMembershipMock } from '@/prfs/mock';
import { proveMembership } from '@/prfs';
import { MetaMaskInpageProvider } from "@metamask/providers";
// import { PRFS_GEN_ENDPOINT } from "@/config/index";
import detectEthereumProvider from "@metamask/detect-provider";

const TREE_DEPTH: number = 32;

export default function Home() {
  let [account, setAccount] = React.useState<string[]>([]);

  React.useEffect(() => {
    console.log('Initializing app');

    let fn = async () => {
      const provider = await detectEthereumProvider();

      if (provider !== window.ethereum) {
        console.error("Do you have multiple wallets installed?");
        return;
      }

      const ethersProvider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      window.ethers = ethersProvider;
      console.log("Found eth provider");

      let accs = await ethersProvider.listAccounts();
      setAccount(accs);
      console.log("Initialized acocunts: %o", accs);
    };

    fn().then((_res) => { });
  }, [setAccount]);

  const proverAddressMembershipMock = React.useCallback(() => {
    proveMembershipMock().then(() => { });
  }, []);

  const proverAddressMembership = React.useCallback(() => {
    proveMembership().then(() => { });
  }, []);

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

function getMerklePath(leafIdx: number, treeDepth: number): NodePos[] {
  let currIdx = leafIdx;
  let merklePath: NodePos[] = [];
  for (let h = 0; h < treeDepth - 1; h += 1) {
    let parentIdx = getParentIdx(currIdx);
    let parentSiblingIdx = getSiblingIdx(parentIdx);

    merklePath.push({
      posW: parentSiblingIdx,
      posH: h,
    });
    currIdx = parentIdx;
  }

  return merklePath;
}

async function fetchData(setProof: Function) {
  console.log("fetch data");

  let accounts = await window.ethers.send("eth_requestAccounts", []);

  if (accounts != null && Array.isArray(accounts)) {
    const account = accounts[0];
    console.log("account", account);

    let u = ethers.utils;
    let signer = window.ethers.getSigner();

    const ethAddress = await signer.getAddress();
    console.log("ethAddress", ethAddress);

    const messageRaw = "test";
    const messageHash = u.hashMessage(messageRaw);
    console.log("message hash", messageHash);

    const signature = await signer.signMessage(messageRaw);
    console.log("signature", signature, signature.length);

    const digest = u.arrayify(messageHash);

    const publicKey = u.recoverPublicKey(digest, signature);
    console.log("recovered publickey", publicKey);

    const computedAddress = u.computeAddress(publicKey);
    console.log("computed address", computedAddress);

    const recoveredAddress = u.recoverAddress(digest, signature);
    console.log("recovered address", recoveredAddress);


    // let leafIdx = 0;
    // let merkleNodePos = getMerklePath(leafIdx, TREE_DEPTH);
    // let setId = "1";

    // let merkleNodes = await axios
    //   .post("http://localhost:4000/get_nodes", {
    //     setId,
    //     pos: merkleNodePos,
    //   })
    //   .then((r) => r.data)
    //   .catch((err) => {
    //     console.log("Error fetching get merkle nodes, err: %s", err);
    //     return;
    //   });

    // console.log("merkleNodes: {:?}", merkleNodes);

    // let rootNodePos: NodePos = {
    //   posW: 0,
    //   posH: 31,
    // };

    // let rootNode = await axios
    //   .post("http://localhost:4000/get_nodes", {
    //     setId,
    //     pos: [rootNodePos],
    //   })
    //   .then((r) => {
    //     if (r.data.nodes.length === 1) {
    //       return r.data.nodes[0];
    //     } else {
    //       throw new Error("root node has to be a single node");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("Error fetching get root node, err: %s", err);
    //     return;
    //   });

    // let proof;
    // try {
    //   console.log('Requesting prfs_gen to generate proof');

    //   const { data } = await axios
    //     .post(`${PRFS_GEN_ENDPOINT}/gen_proof`, {
    //       address: account,
    //       publicKey,
    //       proofType: "asset_proof_1",
    //       signature,
    //       merklePath: merkleNodes.nodes,
    //       leafIdx: 0,
    //       root: rootNode,
    //       messageRaw,
    //       messageHash,
    //     });
    //   proof = data.proof;
    // } catch (err) {
    //   console.log("Error fetching get_proof, err: %s", err);
    //   return;
    // }

    // setProof(proof.join(", "));
  }
};

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
