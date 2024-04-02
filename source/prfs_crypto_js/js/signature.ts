import {
  secp256k1 as secp,
  RecoveredSignatureType,
} from "@taigalabs/prfs-crypto-deps-js/noble_curves/secp256k1";
import { keccak256 } from "@taigalabs/prfs-crypto-deps-js/viem";
import { toUtf8Bytes } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";

import { initWasm, wasmSingleton } from "./wasm_wrapper/wasm";

export async function prfsSign(
  skHex: string,
  msg: string,
): Promise<{ sig: RecoveredSignatureType; msgHash: Uint8Array }> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const bytes = toUtf8Bytes(msg);
  const msgHash = keccak256(bytes, "bytes");
  const sig = secp.sign(msgHash, BigInt(skHex));
  return { sig, msgHash };
}
