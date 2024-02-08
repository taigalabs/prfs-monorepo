import React from "react";
import { PrivateKey } from "@taigalabs/prfs-crypto-js";
import { toHex } from "@taigalabs/prfs-crypto-deps-js/viem";
import { secp256k1 } from "@taigalabs/prfs-crypto-deps-js/noble_curves/secp256k1";

export function useRandomKeyPair(): { sk: PrivateKey; pkHex: string } {
  const secretKeyRef = React.useRef<PrivateKey | null>(null);

  if (!secretKeyRef.current) {
    const sk = new PrivateKey();
    secretKeyRef.current = sk;
  }

  const pkHex = secretKeyRef.current.publicKey.toHex();

  return {
    sk: secretKeyRef.current,
    pkHex,
  };
}

export function useSessionKey() {
  return React.useMemo(() => {
    const priv = secp256k1.utils.randomPrivateKey();
    const pk = secp256k1.getPublicKey(priv);
    const session_key = toHex(pk);

    return session_key;
  }, []);
}
