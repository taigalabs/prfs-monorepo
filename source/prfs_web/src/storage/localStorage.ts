const PRFS_SIG = "prfs_sig";
const PRFS_WALLET_ADDR = "prfs_wallet_addr";

export interface PrfsAccount {
  sig: string;
  id: string;
  walletAddr: string;
}

function getPrfsAccount(): PrfsAccount | null {
  let sig = window.localStorage.getItem(PRFS_SIG);
  let walletAddr = window.localStorage.getItem(PRFS_WALLET_ADDR);

  if (sig !== null && walletAddr !== null) {
    return {
      sig,
      id: sig.substring(0, 10),
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
