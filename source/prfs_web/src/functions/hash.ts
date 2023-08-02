import { keccak256, toUtf8Bytes } from "ethers/lib/utils";

export function keccakHash(m: string) {
  // const arr = new TextEncoder().encode(
  //   `${selectedCircuit.circuit_id}+${selectedCircuit.program.program_id}`
  // );

  // const str = new TextDecoder().decode(uint8array);
  //

  let arr = toUtf8Bytes(m);
  const hash = keccak256(arr);
  return hash.toString();
}
