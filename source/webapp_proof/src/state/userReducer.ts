import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
  LoadPrfsAccountPayload,
  // Action,
  // LoadPrfsAccountAction,
  // SignInAction,
  SignInPayload,
  SignOutPayload,
  SignUpPayload,
} from "./actions";
import localStore from "@/storage/localStore";
import { RootState } from "./store";

export interface LocalPrfsAccount {
  prfsAccount: PrfsAccount;
  walletAddr: string;
}

export interface UserState {
  localPrfsAccount: LocalPrfsAccount | undefined;
}

const initialState: UserState = {
  localPrfsAccount: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state: UserState, action: PayloadAction<SignInPayload>) => {
      handleSignIn(state, action);
    },
    signUp: (state, action) => {
      handleSignUp(state, action);
    },
    loadPrfsAccount: (state, action) => {
      handleLoadPrfsAccount(state, action);
    },
    signOut: (state, action) => {
      handleSignOut(state, action);
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

export const { signIn, signUp, loadPrfsAccount, signOut } = userSlice.actions;

export const selectLocalPrfsAccount = (state: RootState) => state.user.localPrfsAccount;

export default userSlice.reducer;

function handleSignIn(state: UserState, action: PayloadAction<SignInPayload>) {
  localStore.putPrfsAccount(action.payload.prfsAccount, action.payload.walletAddr);

  // return {
  //   ...state,
  //   localPrfsAccount: {
  //     prfsAccount: action.payload.prfsAccount,
  //     walletAddr: action.payload.walletAddr,
  //   },
  // };

  state.localPrfsAccount = {
    prfsAccount: action.payload.prfsAccount,
    walletAddr: action.payload.walletAddr,
  };
}

function handleSignUp(state: UserState, action: PayloadAction<SignUpPayload>) {
  // return {
  //   ...state,
  // };
}

function handleLoadPrfsAccount(state: UserState, action: PayloadAction<LoadPrfsAccountPayload>) {
  // return {
  //   ...state,
  //   localPrfsAccount: {
  //     // sig: action.payload.sig,
  //     // id: action.payload.id,
  //     prfsAccount: action.payload.prfsAccount,
  //     walletAddr: action.payload.walletAddr,
  //   },
  // };
  state.localPrfsAccount = {
    prfsAccount: action.payload.prfsAccount,
    walletAddr: action.payload.walletAddr,
  };
}

function handleSignOut(state: UserState, _action: PayloadAction<SignOutPayload>) {
  state.localPrfsAccount = undefined;
}
