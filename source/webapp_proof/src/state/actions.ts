import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";

export type LoadPrfsAccountAction = {
  type: "load_prfs_account";
  payload: {
    prfsAccount: PrfsAccount;
    walletAddr: string;
  };
};

export type SignInActionPayload = {
  // type: "sign_in";
  // payload: {
  prfsAccount: PrfsAccount;
  walletAddr: string;
  // };
};

export type SignOutAction = {
  type: "sign_out";
};

export type SignUpAction = {
  type: "sign_up";
  payload: {
    sig: string;
    id: string;
    walletAddr: string;
  };
};

// export type Action = SignInAction | SignUpAction | SignOutAction | LoadPrfsAccountAction;
