import { hexlify, keccak256, toUtf8Bytes } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { secp256k1 as secp } from "@taigalabs/prfs-crypto-deps-js/noble_curves/secp256k1";
import { poseidon_2, sigPoseidon } from "@taigalabs/prfs-crypto-js";

export async function deriveProofKey(sk: string, preImage: string) {
  const { hashed } = await sigPoseidon(sk, preImage);
  const publicKey = secp.getPublicKey(hashed);

  return {
    skHex: hexlify(hashed),
    pkHex: hexlify(publicKey),
  };
}
