import { wasmBytes } from "./build/prfs_crypto_js_bytes";

export declare type WasmTypes = typeof import("./build");

export const wasmSingleton: WasmSingleton = {
  wasm: null,
};

export async function initWasm() {
  const prfsWasm = await import("./build");
  prfsWasm.initSync(wasmBytes);

  return prfsWasm;
}

interface WasmSingleton {
  wasm: typeof import("./build") | null;
}
