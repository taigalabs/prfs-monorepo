import { hexlify, keccak256, toUtf8Bytes } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { secp256k1 as secp } from "@taigalabs/prfs-crypto-deps-js/noble_curves/secp256k1";

import { poseidon_2 } from "./poseidon";

export async function deriveProofKey(arg: string) {
  const arg_ = keccak256(toUtf8Bytes(arg)).substring(2);
  const argHash = await poseidon_2(arg_);

  const skHex = hexlify(argHash);
  const publicKey = secp.getPublicKey(argHash);

  return {
    skHex,
    publicKey,
  };
}
