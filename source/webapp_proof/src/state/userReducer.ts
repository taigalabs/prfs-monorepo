import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
  // Action,
  LoadPrfsAccountAction,
  // SignInAction,
  SignInActionPayload,
  SignOutAction,
  SignUpAction,
} from "./actions";
import localStore from "@/storage/localStore";

export interface LocalPrfsAccount {
  prfsAccount: PrfsAccount | undefined;
  walletAddr: string;
}

export interface UserState {
  localPrfsAccount: LocalPrfsAccount | undefined;
}

export const userReducer = createSlice({
  name: "user",
  initialState: {
    localPrfsAccount: undefined,
  },
  reducers: {
    signIn: (state: UserState, action: PayloadAction<SignInActionPayload>) => {
      return handleSignIn(state, action);
    },
    signUp: (state, action) => {
      return handleSignUp(state, action);
    },
    loadPrfsAccount: (state, action) => {
      return handleLoadPrfsAccount(state, action);
    },
    signOut: (state, ation) => {
      return handleSignOut(state, action);
    },
  },
  // console.log("reducer, action: %o", action);

  // switch (action.type) {
  //   // case "sign_in":
  //   case "sign_up":
  //     return handleSignUp(state, action);
  //   case "load_prfs_account":
  //     return handleLoadPrfsAccount(state, action);
  //   case "sign_out":
  //     return handleSignOut(state, action);
  //   default:
  //     throw new Error("no action handler");
  // }
});

function handleSignIn(state: UserState, action: SignInAction): AppState {
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
