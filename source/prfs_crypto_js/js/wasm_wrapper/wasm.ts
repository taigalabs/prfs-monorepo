import { wasmBytes } from "./build/prfs_crypto_js_bytes";
import { InitOutput } from "./build/prfs_crypto_js";

export { InitOutput };

export async function initWasm(): Promise<InitOutput> {
  const prfsWasm = await import("./build");

  const wasm = prfsWasm.initSync(wasmBytes);
  return wasm;
}
