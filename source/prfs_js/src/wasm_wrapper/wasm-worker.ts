import { threads } from "wasm-feature-detect";
import * as Comlink from "comlink";

import { Prfs } from '../prfs';

async function initHandlers() {
  console.log("wasm-worker, initHandlers()");

  // If threads are unsupported in this browser, skip this handler.
  if (!(await threads())) return;

  console.log("initHandlers(): importing multi");

  const prfsWasm = await import("../wasm_build/build/prfs_wasm");

  await prfsWasm.default("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
  await prfsWasm.initThreadPool(navigator.hardwareConcurrency);
  // return wrapExports(multiThread);

  console.log("prfsWasm", !!prfsWasm);

  let prfs = new Prfs(prfsWasm);
  console.log(123, prfs);

  return Comlink.proxy({
    supportsThreads: !!prfsWasm,
    prfs,
  });
}

console.log(55);

Comlink.expose({
  handler: initHandlers(),
});
