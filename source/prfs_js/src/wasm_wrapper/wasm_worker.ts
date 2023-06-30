import { threads } from "wasm-feature-detect";
import * as Comlink from "comlink";
import { Prfs, defaultPubkeyMembershipPConfig } from "../prfs";
import { WrappedPrfs } from "./types";

// function wrapExports(prfs: Prfs) {
//   const poseidon = prfs.newPoseidon();

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
// }

// async function initHandlers() {
//   // console.log("wasm-worker, initHandlers()");

//   // If threads are unsupported in this browser, skip this handler.
//   if (!(await threads())) return;

//   // console.log("initHandlers(): importing multi");

//   const prfsWasm = await import("./build/prfs_wasm");
//   await prfsWasm.default("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
//   await prfsWasm.initThreadPool(navigator.hardwareConcurrency);

//   // let prfs = new Prfs(prfsWasm);
//   //
//   // const wrapped = wrapExports(prfs);

//   console.log("initHandlers()");

//   return Comlink.proxy({
//     supportsThreads: !!prfsWasm,
//     f: () => {
//       console.log(55);
//       return 55;
//     }
//     // prfs: wrapped
//   });
// }

// Comlink.expose({
//   handlers: initHandlers()
// });

function wrapExports() {
  console.log("wasm-worker, wrapExports()");

  return () => {
    const start = performance.now();
    // const rawImageData = generate(width, height, maxIterations);
    const time = performance.now() - start;
    return {
      // Little perf boost to transfer data to the main thread w/o copying.
      // rawImageData: Comlink.transfer(rawImageData, [rawImageData.buffer]),
      time
    };
  };
}

async function initHandlers() {
  console.log("wasm-worker, initHandlers()");

  // console.log("wasm-worker, initHandlers()");

  // If threads are unsupported in this browser, skip this handler.
  if (!(await threads())) return;

  // console.log("initHandlers(): importing multi");

  // const prfsWasm = await import("./build/prfs_wasm");
  // await prfsWasm.default("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
  // await prfsWasm.initThreadPool(navigator.hardwareConcurrency);
  // let prfs = new Prfs(prfsWasm);
  // console.log(66, prfs);

  // let [singleThread, multiThread] = await Promise.all([
  //   (async () => {
  //     console.log("initHandlers(): importing single");

  //     const singleThread = await import(
  //       "../../demo/pkg/wasm_bindgen_rayon_demo.js"
  //     );
  //     await singleThread.default();
  //     return wrapExports(singleThread);
  //   })(),
  //   (async () => {
  //     console.log("initHandlers(): importing multi");

  //     // If threads are unsupported in this browser, skip this handler.
  //     if (!(await threads())) return;
  //     const multiThread = await import(
  //       "../../demo/pkg-parallel/wasm_bindgen_rayon_demo.js"
  //     );

  //     console.log("initHandlers(): multiThreadImported");

  //     await multiThread.default();
  //     await multiThread.initThreadPool(navigator.hardwareConcurrency);
  //     return wrapExports(multiThread);
  //   })()
  // ]);
  let multiThread = wrapExports();

  // console.log("multithread", !!multiThread);

  return Comlink.proxy({
    // singleThread,
    supportsThreads: !!multiThread,
    multiThread
  });
}

const handlers = await initHandlers();

console.log(55);

Comlink.expose({
  handlers
});
