import { PrfsAccount } from "@/state/reducer";

const PRFS_SIG = "prfs_sig";
const PRFS_WALLET_ADDR = "prfs_wallet_addr";

function getPrfsAccount(): PrfsAccount | null {
  let sig = window.localStorage.getItem(PRFS_SIG);
  let walletAddr = window.localStorage.getItem(PRFS_WALLET_ADDR);

  if (sig !== null && walletAddr !== null) {
    let id = sig.substring(0, 10);
    return {
      sig,
      id,
      walletAddr,
    };
  } else {
    return null;
  }
}

function putPrfsAccount(sig: string, walletAddr: string) {
  window.localStorage.setItem(PRFS_SIG, sig);
  window.localStorage.setItem(PRFS_WALLET_ADDR, walletAddr);
}

export default {
  getPrfsAccount,
  putPrfsAccount,
};
