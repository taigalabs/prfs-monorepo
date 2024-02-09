import { secp256k1 } from "@taigalabs/prfs-crypto-deps-js/noble_curves/secp256k1";
import { toHex } from "@taigalabs/prfs-crypto-deps-js/viem";

export function createSessionKey() {
  const priv = secp256k1.utils.randomPrivateKey();
  const pk = secp256k1.getPublicKey(priv);
  const session_key = toHex(pk);

  return session_key;
}
