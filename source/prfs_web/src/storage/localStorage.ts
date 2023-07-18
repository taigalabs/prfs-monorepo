import { PrfsAccount } from "@/state/reducer";

const PRFS_SIG = "prfs_sig";
const PRFS_WALLET_ADDR = "prfs_wallet_addr";

function getPrfsAccount(): PrfsAccount | null {
  let sig = window.localStorage.getItem(PRFS_SIG);
  let walletAddr = window.localStorage.getItem(PRFS_WALLET_ADDR);

  if (sig === null || walletAddr === null) {
    return null;
  }

  if (sig !== null && sig.length < 1) {
    removePrfsAccount();
  }

  if (walletAddr !== null && walletAddr.length < 1) {
    removePrfsAccount();
  }

  let id = sig.substring(0, 10);
  return {
    sig,
    id,
    walletAddr,
  };
}

function putPrfsAccount(sig: string, walletAddr: string) {
  window.localStorage.setItem(PRFS_SIG, sig);
  window.localStorage.setItem(PRFS_WALLET_ADDR, walletAddr);
}

function removePrfsAccount() {
  window.localStorage.removeItem(PRFS_SIG);
  window.localStorage.removeItem(PRFS_WALLET_ADDR);
}

export default {
  getPrfsAccount,
  putPrfsAccount,
  removePrfsAccount,
};
