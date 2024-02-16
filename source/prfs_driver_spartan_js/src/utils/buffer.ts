import { bigIntToBytes } from "@taigalabs/prfs-crypto-js";

export function serializeBigintArray(elems: bigint[]): Uint8Array {
  const serialized = new Uint8Array(32 * elems.length);

  const maxSize = BigInt(Math.pow(2, 32) - 1);
  for (const [idx, el] of elems.entries()) {
    if (el > maxSize) {
      throw new Error("Element needs to be less than 2^32");
    }

    serialized.set(bigIntToBytes(el, 32), idx * 32);
  }

  // serialized.set(bigIntToBytes(elems[0], 32), 0);
  // // serialized.set(bigIntToBytes(elems[1], 32), 32);
  // // serialized.set(bigIntToBytes(elems[2], 32), 64);
  // // serialized.set(bigIntToBytes(elems[3], 32), 96);
  // // serialized.set(bigIntToBytes(elems[4], 32), 128);
  // // serialized.set(bigIntToBytes(elems[5], 32), 160);
  return serialized;
}
