import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";

export type LoadPrfsAccountPayload = {
  // type: "load_prfs_account";
  // payload: {
  prfsAccount: PrfsAccount;
  walletAddr: string;
  // };
};

export type SignInPayload = {
  // type: "sign_in";
  // payload: {
  prfsAccount: PrfsAccount;
  walletAddr: string;
  // };
};

export type SignOutPayload = {
  // type: "sign_out";
};

export type SignUpPayload = {
  // type: "sign_up";
  // payload: {
  sig: string;
  id: string;
  walletAddr: string;
  // };
};

// export type Action = SignInAction | SignUpAction | SignOutAction | LoadPrfsAccountAction;
