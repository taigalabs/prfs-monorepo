import * as ethers from "ethers";

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

export async function poseidon_2(msg: string | Uint8Array): Promise<Uint8Array> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }
  const { wasm } = wasmSingleton;

  let mBytes = null;
  if (typeof msg === "string") {
    const msgBytes = ethers.utils.toUtf8Bytes(msg);
    mBytes = msgBytes;
  } else {
    mBytes = msg;
  }

  if (mBytes.length > 64) {
    throw new Error("msg has to be shorter than or equal to 64 bytes");
  }

  if (mBytes.length < 64) {
    let arr = new Uint8Array(64);
    arr.set(mBytes, 64 - mBytes.length);
    mBytes = arr;
  }

  const pwHash = wasm.poseidon_2(mBytes.subarray(0, 32), mBytes.subarray(32, 64));
  return pwHash;
}

export async function poseidon_2_bigint(msg: bigint[]): Promise<Uint8Array> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }
  const { wasm } = wasmSingleton;

  if (msg.length !== 2) {
    throw new Error("Poseidon2 now only supports arity of two");
  }

  let mBytes = new Uint8Array(32 * msg.length);
  for (let i = 0; i < msg.length; i++) {
    mBytes.set(bigIntToLeBytes(msg[i], 32), i * 32);
  }

  // if (mBytes.length > 64) {
  //   throw new Error("msg has to be shorter than or equal to 64 bytes");
  // }

  // if (mBytes.length < 64) {
  //   let arr = new Uint8Array(64);
  //   arr.set(mBytes, 64 - mBytes.length);
  //   mBytes = arr;
  // }

  const pwHash = wasm.poseidon_2(mBytes.subarray(0, 32), mBytes.subarray(32, 64));
  return pwHash;
}
