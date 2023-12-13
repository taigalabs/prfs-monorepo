import * as ethers from "ethers";
import { secp256k1 as secp } from "@noble/curves/secp256k1";
import { hexlify } from "ethers/lib/utils";

import { initWasm, wasmSingleton } from "./wasm_wrapper/wasm";
import { poseidon_2 } from "./poseidon";
import { bigIntToLeBytes } from "./bigint";

export async function makeCredential(args: MakeCredentialArgs): Promise<Credential> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const { email, password_1, password_2 } = args;
  const pw = `${email}${password_1}${password_2}`;
  const pwInt = await poseidon_2(pw);

  const pk = secp.getPublicKey(pwInt, false);
  const s1 = pk.subarray(1);
  const s2 = await poseidon_2(s1);
  const s2Bytes = bigIntToLeBytes(s2, 32);
  const id = s2Bytes.subarray(0, 20);

  return {
    secret_key: hexlify(pwInt),
    public_key: hexlify(pk),
    id: hexlify(id),
  };
}

export async function prfsSign(skHex: string, msg: string) {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const msgHash = await poseidon_2(msg);
  let h = `0x${msgHash.toString()}`;
  console.log(11, h);
  // const msgHash = wasm.poseidon(msgBytes);
  return secp.sign(h, BigInt(skHex));
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
