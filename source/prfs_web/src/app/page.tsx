"use client";

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import rayon from "./rayon";
import { useState } from "react";
// import {
//   Prfs,
//   // init,
//   // MembershipProver2,
//   // MembershipVerifier,
//   // Tree,
//   // Poseidon,
//   defaultAddressMembershipPConfig,
//   defaultPubkeyMembershipPConfig,
//   defaultPubkeyMembershipVConfig,
//   defaultAddressMembershipVConfig
// } from "@taigalabs/prfs-js";
import {
  ecrecover,
  ecsign,
  hashPersonalMessage,
  privateToAddress,
  privateToPublic,
  pubToAddress
} from "@ethereumjs/util";

import * as Comlink from "comlink";

export default function Home() {
  React.useEffect(() => {
    console.log("Home()");

    rayon().then(() => {
      console.log("Home() 222");
    });

    // Create a separate thread from wasm-worker.js and get a proxy to its handlers.
    // let handlers = await(
    //   Comlink.wrap(
    //     new Worker(new URL("./wasm-worker2.ts", import.meta.url), {
    //       type: "module",
    //     })
    //   ) as any
    // ).handlers;

    // console.log("init() 22", await handlers);
    // console.log("init() 33", await handlers.supportsThreads);
  }, []);

  const proverAddressMembership = React.useCallback(() => {
    // async function fn() {
    //   // let handlers = await (
    //   //   Comlink.wrap(
    //   //     new Worker(new URL("./wasm-worker2.ts", import.meta.url), {
    //   //       type: "module",
    //   //     })
    //   //   ) as any
    //   // ).handlers;
    //   // console.log("init() 22", await handlers);
    //   // console.log("init() 33", await handlers.supportsThreads);
    //   const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
    //   const msg = Buffer.from("harry potter");
    //   const msgHash = hashPersonalMessage(msg);
    //   const { v, r, s } = ecsign(msgHash, privKey);
    //   const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;
    //   let prfs = await Prfs.newInstance();
    //   console.log(22, prfs);
    //   const poseidon = prfs.newPoseidon();
    //   const treeDepth = 20;
    //   // const addressTree = new Tree(treeDepth, poseidon);
    //   const addressTree = prfs.newTree(treeDepth, poseidon);
    //   console.log(44, addressTree);
    //   const proverAddress = BigInt(
    //     "0x" + privateToAddress(privKey).toString("hex")
    //   );
    //   addressTree.insert(proverAddress);
    //   // Insert other members into the tree
    //   for (const member of ["🕵️", "🥷", "👩‍🔬"]) {
    //     const pubKey = privateToPublic(
    //       Buffer.from("".padStart(16, member), "utf16le")
    //     );
    //     const address = BigInt("0x" + pubToAddress(pubKey).toString("hex"));
    //     addressTree.insert(address);
    //   }
    //   const index = addressTree.indexOf(proverAddress);
    //   const merkleProof = addressTree.createProof(index);
    //   console.log("Proving...");
    //   console.time("Full proving time");
    //   const prover = prfs.newMembershipProver({
    //     ...defaultAddressMembershipPConfig,
    //     enableProfiler: true
    //   });
    //   console.log(11, prover);
    //   const { proof, publicInput } = await prover.prove(
    //     sig,
    //     msgHash,
    //     merkleProof
    //   );
    //   console.log(33, proof, publicInput);
    //   console.timeEnd("Full proving time");
    //   console.log(
    //     "Raw proof size (excluding public input)",
    //     proof.length,
    //     "bytes"
    //   );
    // }
    //   console.log("Verifying...");
    //   const verifier = new MembershipVerifier({
    //     ...defaultAddressMembershipVConfig,
    //     enableProfiler: true
    //   });
    //   await verifier.init();
    //   console.time("Verification time");
    //   const result = await verifier.verify(proof, publicInput.serialize());
    //   console.timeEnd("Verification time");
    //   if (result) {
    //     console.log("Successfully verified proof!");
    //   } else {
    //     console.log("Failed to verify proof :(");
    //   }
    // fn().then(() => { });
  }, []);

  return (
    <div>
      {/* <button onClick={provePubKeyMembership}> */}
      {/*   Prove Public Key Membership */}
      {/* </button> */}
      <button onClick={proverAddressMembership}>
        Prove Address Membership
      </button>

      <p>
        This is a demo for
        <a href="https://github.com/GoogleChromeLabs/wasm-bindgen-rayon">
          wasm-bindgen-rayon
        </a>
        , generating a
        <a href="https://en.wikipedia.org/wiki/Mandelbrot_set">
          Mandelbrot fractal
        </a>
        with WebAssembly threads.
      </p>
      <input
        type="button"
        id="singleThread"
        value="Draw using a single thread"
        disabled
      />
      <input
        type="button"
        id="multiThread"
        value="Draw using all available threads"
        disabled
      />
      <output id="time"></output>
      <br />
      <canvas id="canvas" width="700" height="700"></canvas>
      {/* <script type="module" src="index.js"></script> */}
    </div>
  );
}

// const provePubKeyMembership = async () => {
//   const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
//   const msg = Buffer.from("harry potter");
//   const msgHash = hashPersonalMessage(msg);

//   const { v, r, s } = ecsign(msgHash, privKey);
//   const pubKey = ecrecover(msgHash, v, r, s);
//   const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;

//   const poseidon = new Poseidon();
//   await poseidon.initWasm();

//   const treeDepth = 20;
//   const pubKeyTree = new Tree(treeDepth, poseidon);

//   const proverPubKeyHash = poseidon.hashPubKey(pubKey);

//   pubKeyTree.insert(proverPubKeyHash);

//   // Insert other members into the tree
//   for (const member of ["🕵️", "🥷", "👩‍🔬"]) {
//     const pubKey = privateToPublic(
//       Buffer.from("".padStart(16, member), "utf16le")
//     );
//     pubKeyTree.insert(poseidon.hashPubKey(pubKey));
//   }

//   const index = pubKeyTree.indexOf(proverPubKeyHash);
//   const merkleProof = pubKeyTree.createProof(index);

//   console.log("Proving...");
//   console.time("Full proving time");

//   const prover = new MembershipProver2({
//     ...defaultPubkeyMembershipPConfig,
//     enableProfiler: true
//   });

//   await prover.init();

//   const { proof, publicInput } = await prover.prove(
//     sig,
//     msgHash,
//     merkleProof
//   );

//   console.timeEnd("Full proving time");
//   console.log(
//     "Raw proof size (excluding public input)",
//     proof.length,
//     "bytes"
//   );

//   return;

//   console.log("Verifying...");
//   const verifier = new MembershipVerifier({
//     ...defaultPubkeyMembershipVConfig,
//     enableProfiler: true
//   });
//   await verifier.init();

//   console.time("Verification time");
//   const result = await verifier.verify(proof, publicInput.serialize());
//   console.timeEnd("Verification time");

//   if (result) {
//     console.log("Successfully verified proof!");
//   } else {
//     console.log("Failed to verify proof :(");
//   }
// };
