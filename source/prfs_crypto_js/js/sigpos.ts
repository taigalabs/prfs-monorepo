import { poseidon_2 } from "./poseidon";
import { prfsSign } from "./signature";

export async function sigPoseidon(sk: string, preImage: string) {
  const { sig } = await prfsSign(sk, preImage);
  const sigBytes = sig.toCompactRawBytes();
  const hashed = await poseidon_2(sigBytes);

  return { sigBytes, hashed };
}
