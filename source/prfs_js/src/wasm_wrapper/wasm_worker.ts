import { threads } from "wasm-feature-detect";
import * as Comlink from "comlink";
import { Prfs } from "../prfs";
import { PrfsWasmType, PrfsHandlers, MerkleProof, PrfsMerkleProof } from "../types";
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
    },
    async makeMerkleProof(leaves: string[], leaf_idx: BigInt, depth: number) {
      // console.log(1111, leaves, leaf_idx, depth);

      let obj = {
        leaves,
        leaf_idx,
        depth
      };

      const merkleProof: PrfsMerkleProof = await prfsWasm.make_merkle_proof(obj);

      let siblings = merkleProof.siblings.map(s => BigInt(s));
      const proof = {
        ...merkleProof,
        root: BigInt(merkleProof.root),
        siblings,
      };

      return proof;
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

  // If threads are unsupported in this browser, skip this handler.
  if (!(await threads())) return;

  const prfsWasm = await import("./build/prfs_wasm");
  await prfsWasm.default("http://localhost:4010/circuits/prfs_wasm_bg.wasm");

  console.log("Web worker: threads are available, concurrency: %o", navigator.hardwareConcurrency);
  await prfsWasm.initThreadPool(navigator.hardwareConcurrency);

  let wrapped = wrapExports(prfsWasm);
  return Comlink.proxy(wrapped);
}

const handlers = initHandlers();

console.log("Wasm method explosed, handlers");

Comlink.expose({
  handlers
});
