import { threads } from "wasm-feature-detect";
import * as Comlink from "comlink";
import { Prfs } from "../prfs";
import { PrfsWasmType, PrfsHandlers } from "../types";
import { bigIntToLeBytes, bytesLeToBigInt } from "../helpers/utils";

function wrapExports(prfsWasm: PrfsWasmType): PrfsHandlers {
  console.log("wasm-worker, wrapExports()");

  return {
    supportsThreads: true,
    async poseidonHash(inputs: Uint8Array) {
      console.log('poseidonHash inputs', inputs);
      const res = prfsWasm.poseidon(inputs);
      console.log('poseidonHash result', res);
      return res;
    }
    // newTree(depth: number) {
    //   return prfs.newTree(depth, poseidon);
    // },
    // membershshipProve() {
    //   return prfs.newMembershipProver(defaultPubkeyMembershipPConfig);
    // }
  };

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

  // return {
  //   supportsThreads: true,
  //   multiThread
  // };
}

async function initHandlers() {
  console.log("wasm-worker, initHandlers()");

  // If threads are unsupported in this browser, skip this handler.
  if (!(await threads())) return;

  const prfsWasm = await import("./build/prfs_wasm");
  await prfsWasm.default("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
  await prfsWasm.initThreadPool(navigator.hardwareConcurrency);

  // let aa = prfsWasm.aa(new Uint8Array());
  // console.log(33, aa);

  // let bb = prfsWasm.bb();
  // console.log(44, bb);

  let wrapped = wrapExports(prfsWasm);

  return Comlink.proxy(wrapped);
}

const handlers = initHandlers();

console.log(55);

Comlink.expose({
  handlers
});
