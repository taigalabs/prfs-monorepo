import { ethers } from "ethers";

import prfsBackend from "@/fetch/prfsBackend";

export async function signIn(walletAddr: string, passhash: string, signer: ethers.Signer) {
  if (walletAddr.length < 1) {
    throw new Error("Connect a wallet first");
  }

  if (passhash.length < 1) {
    throw new Error("Hash passcode first");
  }

  try {
    let sig = await signer.signMessage(passhash);
    let resp = await prfsBackend.signInPrfsAccount(sig);

    if (resp.error) {
      throw new Error(resp.error);
    }

    return resp;
  } catch (err) {
    throw new Error("sign in fail, err: %s", err);
  }
}
