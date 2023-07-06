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
      const res = prfsWasm.poseidon(inputs);
      return res;
    },
    async prove(circuit: Uint8Array, vars: Uint8Array, public_inputs: Uint8Array) {
      const res = prfsWasm.prove(circuit, vars, public_inputs);
      return res;
    },
    async verify(circuit: Uint8Array, proof: Uint8Array, public_inputs: Uint8Array) {
      const res = prfsWasm.verify(circuit, proof, public_inputs);
      return res;
    }
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

console.log('Wasm method explosed, handlers');

Comlink.expose({
  handlers
});
