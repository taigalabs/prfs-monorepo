import { keccak256, toUtf8Bytes } from "ethers/lib/utils";

export function keccakHash(m: string) {
  let arr = toUtf8Bytes(m);
  const hash = keccak256(arr);
  return hash;
}
