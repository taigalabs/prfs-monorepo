import { PrivateKey } from "@taigalabs/prfs-crypto-deps-js/eciesjs";

export function createRandomKeyPair() {
  const sk = new PrivateKey();
  const pkHex = sk.publicKey.toHex();

  return {
    sk,
    pkHex: `0x${pkHex}`,
  };
}

export interface KeyPair {
  sk: PrivateKey;
  pkHex: string;
}
