import { sigPoseidon } from "@taigalabs/prfs-crypto-js";

import { WALLET_CM_STEM } from "..";

export async function makeWalletCacheKeyCm(sk: string, idx: number) {
  return sigPoseidon(sk, `${WALLET_CM_STEM}_${idx}`);
}

export async function makeAppSignCm(sk: string, appId: string) {
  return sigPoseidon(sk, appId);
}
