import { hexlify, keccak256, toUtf8Bytes } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { PrivateKey } from "@taigalabs/prfs-crypto-deps-js/eciesjs";

import { poseidon_2 } from "./poseidon";

export async function deriveProofKey(arg: string) {
  const nonceRaw_ = keccak256(toUtf8Bytes(arg)).substring(2);
  const nonceHash = await poseidon_2(nonceRaw_);

  const sk = hexlify(nonceHash);
  return sk;
}
