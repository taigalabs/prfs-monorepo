export type SignInAction = {
  type: "sign_in";
  payload: {
    sig: string;
    id: string;
  };
};

export type SignUpAction = {
  type: "sign_up";
  payload: {
    sig: string;
    id: string;
  };
};

export type Action = SignInAction | SignUpAction;
