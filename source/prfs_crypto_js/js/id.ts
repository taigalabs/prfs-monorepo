import * as ethers from "ethers";
import * as secp from "@noble/secp256k1";
import { hexlify } from "ethers/lib/utils";

import { initWasm } from "./wasm_wrapper/wasm";
import { bytesToBigInt } from "./bigint";

const wasmSingleton: WasmSingleton = {
  wasm: null,
};

export async function makeCredential(args: MakeCredentialArgs): Promise<Credential> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const { wasm } = wasmSingleton;
  const { email, password_1, password_2 } = args;

  const pw = `${email}${password_1}${password_2}`;
  const pwBytes = ethers.utils.toUtf8Bytes(pw);
  const pwHash = wasm.poseidon(pwBytes);
  const pwInt = bytesToBigInt(pwHash);

  const pk = secp.getPublicKey(pwInt, false);
  const s1 = pk.subarray(1);
  const s2 = wasm.poseidon(s1);
  const id = s2.subarray(0, 20);

  // console.log("credential", pwInt, pk, s1, s2, id);

  return {
    secret_key: hexlify(pwInt),
    public_key: hexlify(pk),
    id: hexlify(id),
  };
}

interface WasmSingleton {
  wasm: typeof import("./wasm_wrapper/build") | null;
}

export interface MakeCredentialArgs {
  email: string;
  password_1: string;
  password_2: string;
}

export interface Credential {
  secret_key: string;
  public_key: string;
  id: string;
}
