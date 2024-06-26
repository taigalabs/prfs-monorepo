import { LocalPrfsAccount } from "@/state/userReducer";
import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";

const PRFS_ACCOUNT = "prfs_account";
const PRFS_WALLET_ADDR = "prfs_wallet_addr";

function getPrfsAccount(): LocalPrfsAccount | null {
  let prfsAccountSer = window.localStorage.getItem(PRFS_ACCOUNT);

  if (!prfsAccountSer) {
    return null;
  }

  if (prfsAccountSer === "undefined") {
    console.error("invalid prfs account was stored, emptying...");
    removePrfsAccount();

    return null;
  }

  let prfsAccount: PrfsAccount;
  try {
    prfsAccount = JSON.parse(prfsAccountSer);
  } catch (err) {
    console.error(err);
    return null;
  }

  const { account_id } = prfsAccount;

  let walletAddr = window.localStorage.getItem(PRFS_WALLET_ADDR);

  if (account_id === null || walletAddr === null) {
    return null;
  }

  if (account_id !== null && account_id.length < 1) {
    removePrfsAccount();
  }

  if (walletAddr !== null && walletAddr.length < 1) {
    removePrfsAccount();
  }

  // let id = sig.substring(0, 10);

  return {
    prfsAccount,
    walletAddr,
  };
}

function putPrfsAccount(prfs_account: PrfsAccount, walletAddr: string) {
  const prfsAccountSer = JSON.stringify(prfs_account);

  window.localStorage.setItem(PRFS_ACCOUNT, prfsAccountSer);
  window.localStorage.setItem(PRFS_WALLET_ADDR, walletAddr);
}

function removePrfsAccount() {
  window.localStorage.removeItem(PRFS_ACCOUNT);
  window.localStorage.removeItem(PRFS_WALLET_ADDR);
}

export default {
  getPrfsAccount,
  putPrfsAccount,
  removePrfsAccount,
};
