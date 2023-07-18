export type SignInAction = {
  type: "sign_in";
  payload: {};
};

export type SignUpAction = {
  type: "sign_up";
  payload: {};
};

export type Action = SignInAction | SignUpAction;
