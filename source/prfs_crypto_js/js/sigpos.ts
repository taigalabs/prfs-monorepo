import { hexlify } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";

import { poseidon_2 } from "./poseidon";
import { prfsSign } from "./signature";

export async function sigPoseidon(sk: string, preImage: string) {
  const sig = await prfsSign(sk, preImage);
  const sigBytes = sig.toCompactRawBytes();
  const hashed = await poseidon_2(sigBytes);

  return { sigBytes, hashed };
}

// export async function makeCommitmentBySigBytes(sigBytes: Uint8Array) {
//   const hashed = await poseidon_2(sigBytes);
//   const hashedHex = hexlify(hashed);

//   return hashedHex;
// }
