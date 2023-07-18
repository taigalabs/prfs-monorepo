import { Action, LoadPrfsAccountAction, SignInAction, SignUpAction } from "./actions";

export interface AppState {
  sig: undefined | string;
  id: undefined | string;
  walletAddr: undefined | string;
}

const reducer = (state: AppState, action: Action) => {
  console.log("reducer, action: %o", action);

  switch (action.type) {
    case "sign_in":
      return handleSignIn(state, action);
    case "sign_up":
      return handleSignUp(state, action);
    case "load_prfs_account":
      return handleLoadPrfsAccount(state, action);
    default:
      throw new Error("no action handler");
  }
};

export default reducer;

function handleSignIn(state: AppState, action: SignInAction): AppState {
  return {
    ...state,
    sig: action.payload.sig,
    id: action.payload.id,
  };
}

function handleSignUp(state: AppState, action: SignUpAction) {
  return {
    ...state,
    sig: action.payload.sig,
    id: action.payload.id,
  };
}

function handleLoadPrfsAccount(state: AppState, action: LoadPrfsAccountAction) {
  return {
    ...state,
    sig: action.payload.sig,
    id: action.payload.id,
    walletAddr: action.payload.walletAddr,
  };
}
