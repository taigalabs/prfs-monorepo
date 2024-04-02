import {
  secp256k1 as secp,
  RecoveredSignatureType,
} from "@taigalabs/prfs-crypto-deps-js/noble_curves/secp256k1";

import { initWasm, wasmSingleton } from "./wasm_wrapper/wasm";
import { poseidon_2, poseidon_2_str } from "./poseidon";
import { keccak256 } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";

export async function prfsSign(skHex: string, msg: string): Promise<RecoveredSignatureType> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  // const msgHash = await poseidon_2_str(msg);
  const msgHash = keccak256(msg);
  const sig = secp.sign(msgHash, BigInt(skHex));
  return sig;
}
