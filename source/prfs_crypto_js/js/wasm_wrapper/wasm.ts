import { wasmBytes } from "./build/prfs_crypto_js_bytes";
import { poseidon } from "./build/prfs_crypto_js";

export declare type WasmTypes = typeof import("./build");

export async function initWasm() {
  const prfsWasm = await import("./build");
  prfsWasm.initSync(wasmBytes);

  return prfsWasm;
}
