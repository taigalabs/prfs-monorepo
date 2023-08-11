import {
  Action,
  LoadPrfsAccountAction,
  SignInAction,
  SignOutAction,
  SignUpAction,
} from "./actions";

export interface PrfsAccount {
  sig: string;
  id: string;
  walletAddr: string;
}

export interface AppState {
  prfsAccount: PrfsAccount | undefined;
}

const reducer = (state: AppState, action: Action) => {
  // console.log("reducer, action: %o", action);

  switch (action.type) {
    case "sign_in":
      return handleSignIn(state, action);
    case "sign_up":
      return handleSignUp(state, action);
    case "load_prfs_account":
      return handleLoadPrfsAccount(state, action);
    case "sign_out":
      return handleSignOut(state, action);
    default:
      throw new Error("no action handler");
  }
};

export default reducer;

function handleSignIn(state: AppState, action: SignInAction): AppState {
  return {
    ...state,
    prfsAccount: {
      sig: action.payload.sig,
      id: action.payload.id,
      walletAddr: action.payload.walletAddr,
    },
  };
}

function handleSignUp(state: AppState, action: SignUpAction): AppState {
  return {
    ...state,
    prfsAccount: {
      sig: action.payload.sig,
      id: action.payload.id,
      walletAddr: action.payload.walletAddr,
    },
  };
}

function handleLoadPrfsAccount(state: AppState, action: LoadPrfsAccountAction): AppState {
  return {
    ...state,
    prfsAccount: {
      sig: action.payload.sig,
      id: action.payload.id,
      walletAddr: action.payload.walletAddr,
    },
  };
}

function handleSignOut(state: AppState, _action: SignOutAction): AppState {
  return {
    ...state,
    prfsAccount: undefined,
  };
}
