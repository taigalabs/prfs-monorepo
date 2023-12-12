import * as ethers from "ethers";
import * as secp from "@noble/secp256k1";
import { hexlify } from "ethers/lib/utils";

import { initWasm, wasmSingleton } from "./wasm_wrapper/wasm";
import { bytesToBigInt } from "./bigint";

export async function poseidon(msg: string): Promise<bigint> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const { wasm } = wasmSingleton;
  const pwBytes = ethers.utils.toUtf8Bytes(msg);
  const pwHash = wasm.poseidon(pwBytes);
  const pwInt = bytesToBigInt(pwHash);

  return pwInt;
}
