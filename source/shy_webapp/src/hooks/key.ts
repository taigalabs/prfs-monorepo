import React from "react";
// import { PrivateKey } from "eciesjs";
import { PrivateKey } from "@taigalabs/prfs-crypto-js";

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
