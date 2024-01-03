import { wasmBytes } from "./build/prfs_crypto_js_bytes";
export const wasmSingleton = {
    wasm: null,
};
export async function initWasm() {
    const prfsWasm = await import("./build");
    prfsWasm.initSync(wasmBytes);
    return prfsWasm;
}
