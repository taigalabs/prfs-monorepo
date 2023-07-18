export type SignInAction = {
  type: "sign_in";
};

export type SignUpAction = {
  type: "sign_up";
};

export type Action = SignInAction | SignUpAction;
