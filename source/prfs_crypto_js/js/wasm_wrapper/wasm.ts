// import { threads } from "wasm-feature-detect";
// import * as Comlink from "comlink";

// import { PrfsWasmType, PrfsHandlers, PrfsMerkleProof, BuildStatus } from "../types";
// import { wasmBytes } from "./build/prfs_wasm_bytes";
import { wasmBytes } from "./build/prfs_driver_utils_wasm_bytes";
// import wasmPackageJson from "./build/package.json";

// function wrapExports(prfsWasm: PrfsWasmType): PrfsHandlers {
//   // console.log("wasm-worker, wrapExports()");

//   return {
//     supportsThreads: true,
//     async poseidonHash(inputs: Uint8Array) {
//       const res = prfsWasm.poseidon(inputs);
//       return res;
//     },
//     async prove(circuit: Uint8Array, vars: Uint8Array, public_inputs: Uint8Array) {
//       const res = prfsWasm.prove(circuit, vars, public_inputs);
//       return Comlink.transfer(res, [res.buffer]);
//     },
//     async verify(circuit: Uint8Array, proof: Uint8Array, public_inputs: Uint8Array) {
//       const res = prfsWasm.verify(circuit, proof, public_inputs);
//       return res;
//     },
//     async makeMerkleProof(leaves: string[], leaf_idx: BigInt, depth: number) {
//       // console.log(1111, leaves, leaf_idx, depth);

//       let obj = {
//         leaves,
//         leaf_idx,
//         depth,
//       };

//       const merkleProof: PrfsMerkleProof = prfsWasm.make_merkle_proof(obj);

//       let siblings = merkleProof.siblings.map(s => BigInt(s));
//       const proof = {
//         ...merkleProof,
//         root: BigInt(merkleProof.root),
//         siblings,
//       };

//       return proof;
//     },
//     async getBuildStatus() {
//       let res = prfsWasm.get_build_status();

//       let buildStatus: BuildStatus = {
//         wasmThreadSupport: res,
//         wasmModulePath: wasmPackageJson.module,
//       };
//       return buildStatus;
//     },
//   };
// }

export async function initWasm() {
  const prfsWasm = await import("./build");

  return prfsWasm.initSync(wasmBytes);
}
