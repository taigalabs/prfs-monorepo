import { secp256k1 as secp } from "@noble/curves/secp256k1";

import { initWasm, wasmSingleton } from "./wasm_wrapper/wasm";
import { poseidon_2 } from "./poseidon";

export async function prfsSign(skHex: string, msg: string) {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const msgHash = await poseidon_2(msg);
  return secp.sign(msgHash, BigInt(skHex));
}
