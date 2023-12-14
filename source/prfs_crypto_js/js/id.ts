import { secp256k1 as secp } from "@noble/curves/secp256k1";
import { hexlify } from "ethers/lib/utils";
import { PrivateKey, encrypt } from "eciesjs";

import { initWasm, wasmSingleton } from "./wasm_wrapper/wasm";
import { poseidon_2 } from "./poseidon";

export async function makePrfsIdCredential(args: MakeCredentialArgs): Promise<PrfsIdCredential> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const { email, password_1, password_2 } = args;
  const pw = `${email}${password_1}${password_2}`;
  const pwHash = await poseidon_2(pw);

  // const pk = secp.getPublicKey(pwHash, false);
  // const s1 = pk.subarray(1);
  // const s2 = await poseidon_2(s1);
  // const id = s2.subarray(0, 20);
  const { public_key, secret_key, id } = await makeECCredential(pwHash);

  const pw2Hash = await poseidon_2(password_2);
  let encryptKey = PrivateKey.fromHex(hexlify(pw2Hash)).publicKey;

  return {
    secret_key,
    public_key,
    id,
    encrypt_key: encryptKey.toHex(),
  };
}

export async function prfsSign(skHex: string, msg: string) {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const msgHash = await poseidon_2(msg);
  return secp.sign(msgHash, BigInt(skHex));
}

export async function makeECCredential(secret: Uint8Array): Promise<ECCredential> {
  if (wasmSingleton.wasm === null) {
    const w = await initWasm();
    wasmSingleton.wasm = w;
  }

  const pk = secp.getPublicKey(secret, false);
  const s1 = pk.subarray(1);
  const s2 = await poseidon_2(s1);
  const id = s2.subarray(0, 20);

  return {
    secret_key: hexlify(secret),
    public_key: hexlify(pk),
    id: hexlify(id),
  };
}

export interface MakeCredentialArgs {
  email: string;
  password_1: string;
  password_2: string;
}

export interface PrfsIdCredential {
  secret_key: string;
  public_key: string;
  id: string;
  encrypt_key: string;
}

export interface ECCredential {
  secret_key: string;
  public_key: string;
  id: string;
}
