import { sigPoseidon } from "@taigalabs/prfs-crypto-js";

import { PRFS_ATTESTATION_STEM, WALLET_CM_STEM } from "..";

export async function makeWalletCacheKeyCm(sk: string, idx: number) {
  return sigPoseidon(sk, `${WALLET_CM_STEM}_${idx}`);
}

export async function makeAppSignInCm(sk: string, appId: string) {
  return sigPoseidon(sk, appId);
}

export function makeWalletAtstCmPreImage(walletAddr: string) {
  return `${PRFS_ATTESTATION_STEM}${walletAddr}`;
}

export function makeWalletAtstCm(sk: string, walletAddr: string) {
  return sigPoseidon(sk, makeWalletAtstCmPreImage(walletAddr));
}
