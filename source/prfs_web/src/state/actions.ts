export type LoadPrfsAccountAction = {
  type: "load_prfs_account";
  payload: {
    sig: string;
    id: string;
    walletAddr: string;
  };
};

export type SignInAction = {
  type: "sign_in";
  payload: {
    sig: string;
    id: string;
    walletAddr: string;
  };
};

export type SignUpAction = {
  type: "sign_up";
  payload: {
    sig: string;
    id: string;
    walletAddr: string;
  };
};

export type Action = SignInAction | SignUpAction | LoadPrfsAccountAction;
