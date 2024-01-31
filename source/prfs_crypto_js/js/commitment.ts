import { hexlify } from "ethers/lib/utils";

import { poseidon_2 } from "./poseidon";
import { prfsSign } from "./signature";

export async function makeCommitment(sk: string, preImage: string) {
  const sig = await prfsSign(sk, preImage);
  const sigBytes = sig.toCompactRawBytes();
  const hashed = await poseidon_2(sigBytes);
  const hashedHex = hexlify(hashed);

  return hashedHex;
}
