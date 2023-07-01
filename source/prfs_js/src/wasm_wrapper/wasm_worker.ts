import { threads } from "wasm-feature-detect";
import * as Comlink from "comlink";
import { Prfs, defaultPubkeyMembershipPConfig } from "../prfs";
import { PrfsWasmType, WrappedPrfs } from "./types";

function wrapExports(prfsWasm: PrfsWasmType) {
  console.log("wasm-worker, wrapExports()");

  let multiThread = () => {
    return prfsWasm.aa();
  };

  //   return {
  //     poseidonHash(inputs: bigint[]) {
  //       let val = poseidon.hash(inputs);
  //       console.log("val", val);
  //       return 0;
  //     }
  //     // newTree(depth: number) {
  //     //   return prfs.newTree(depth, poseidon);
  //     // },
  //     // membershshipProve() {
  //     //   return prfs.newMembershipProver(defaultPubkeyMembershipPConfig);
  //     // }
  //   };

  // return () => {
  //   const start = performance.now();
  //   // const rawImageData = generate(width, height, maxIterations);
  //   const time = performance.now() - start;
  //   return {
  //     // Little perf boost to transfer data to the main thread w/o copying.
  //     // rawImageData: Comlink.transfer(rawImageData, [rawImageData.buffer]),
  //     time
  //   };
  // };
  //

  return {
    supportsThreads: !!multiThread,
    multiThread
  };
}

async function initHandlers() {
  console.log("wasm-worker, initHandlers()");

  // If threads are unsupported in this browser, skip this handler.
  if (!(await threads())) return;

  const prfsWasm = await import("./build/prfs_wasm");
  await prfsWasm.default("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
  await prfsWasm.initThreadPool(navigator.hardwareConcurrency);

  let wrapped = wrapExports(prfsWasm);

  return Comlink.proxy(wrapped);
}

const handlers = initHandlers();

console.log(55);

Comlink.expose({
  handlers
});
