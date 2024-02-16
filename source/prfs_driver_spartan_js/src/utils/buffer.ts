import { bigIntToBytes } from "@taigalabs/prfs-crypto-js";

export function serializeBigintArray(elems: bigint[]): Uint8Array {
  const serialized = new Uint8Array(32 * elems.length);

  const maxSize = BigInt(Math.pow(2, 256) - 1);
  for (const [idx, el] of elems.entries()) {
    if (el > maxSize) {
      throw new Error(`Element needs to be less than 2^32, elem: ${el}`);
    }

    serialized.set(bigIntToBytes(el, 32), idx * 32);
  }

  return serialized;
}
