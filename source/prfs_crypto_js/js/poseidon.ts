import * as ethers from "@taigalabs/prfs-crypto-deps-js/ethers";

import { initWasm, wasmSingleton } from "./wasm_wrapper/wasm";
import { bigIntToLeBytes, bytesToBigInt } from "./bigint";

// @deprecated
export async function poseidon(msg: string): Promise<bigint> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const { wasm } = wasmSingleton;
  const msgBytes = ethers.utils.toUtf8Bytes(msg);
  const pwHash = wasm.poseidon(msgBytes);
  const pwInt = bytesToBigInt(pwHash);

  return pwInt;
}

export async function poseidon_2(msg: Uint8Array): Promise<Uint8Array> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const { wasm } = wasmSingleton;
  let mBytes = msg;

  if (mBytes.length > 64) {
    throw new Error("msg has to be shorter than or equal to 64 bytes");
  }

  if (mBytes.length < 64) {
    let arr = new Uint8Array(64);
    arr.set(mBytes, 64 - mBytes.length);
    mBytes = arr;
  }

  // console.log("Calling poseidon, mbytes: %s", mBytes);
  const hashed = wasm.poseidon_2(mBytes.subarray(0, 32), mBytes.subarray(32, 64));
  return hashed;
}

export async function poseidon_2_str(msg: string): Promise<Uint8Array> {
  const msgBytes = ethers.utils.toUtf8Bytes(msg);
  return poseidon_2(msgBytes);
}

export async function poseidon_2_bigint_le(msg: bigint[]): Promise<Uint8Array> {
  if (msg.length !== 2) {
    throw new Error("Poseidon2 now only supports arity of two");
  }

  let mBytes = new Uint8Array(32 * msg.length);
  for (let i = 0; i < msg.length; i++) {
    mBytes.set(bigIntToLeBytes(msg[i], 32), i * 32);
  }

  // console.log("Calling poseidon, mbytes: %s", mBytes);
  return poseidon_2(mBytes);
}
