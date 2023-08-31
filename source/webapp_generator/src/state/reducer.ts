import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";

import {
  Action,
  LoadPrfsAccountAction,
  SignInAction,
  SignOutAction,
  SignUpAction,
} from "./actions";
import localStore from "@/storage/localStore";

export interface LocalPrfsAccount {
  prfsAccount: PrfsAccount | undefined;
  walletAddr: string;
}

export interface AppState {
  localPrfsAccount: LocalPrfsAccount | undefined;
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
  localStore.putPrfsAccount(action.payload.prfsAccount, action.payload.walletAddr);

  return {
    ...state,
    localPrfsAccount: {
      prfsAccount: action.payload.prfsAccount,
      walletAddr: action.payload.walletAddr,
    },
  };
}

function handleSignUp(state: AppState, action: SignUpAction): AppState {
  return {
    ...state,
  };
}

function handleLoadPrfsAccount(state: AppState, action: LoadPrfsAccountAction): AppState {
  return {
    ...state,
    localPrfsAccount: {
      // sig: action.payload.sig,
      // id: action.payload.id,
      prfsAccount: action.payload.prfsAccount,
      walletAddr: action.payload.walletAddr,
    },
  };
}

function handleSignOut(state: AppState, _action: SignOutAction): AppState {
  return {
    ...state,
    localPrfsAccount: undefined,
  };
}
