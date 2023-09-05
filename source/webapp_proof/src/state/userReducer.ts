import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { LoadPrfsAccountPayload, SignInPayload, SignOutPayload, SignUpPayload } from "./actions";
import localStore from "@/storage/localStore";
import { RootState } from "./store";

export interface LocalPrfsAccount {
  prfsAccount: PrfsAccount;
  walletAddr: string;
}

export interface UserState {
  localPrfsAccount: LocalPrfsAccount | undefined;
  temp: number;
}

const initialState: UserState = {
  localPrfsAccount: undefined,
  temp: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state: UserState, action: PayloadAction<SignInPayload>) => {
      return handleSignIn(state, action);
    },
    signUp: (state, action) => {
      return handleSignUp(state, action);
    },
    loadPrfsAccount: (state, action: PayloadAction<LoadPrfsAccountPayload>) => {
      return handleLoadPrfsAccount(state, action);
    },
    signOut: (state, action) => {
      return handleSignOut(state, action);
    },
  },
});

export const { signIn, signUp, loadPrfsAccount, signOut } = userSlice.actions;

export default userSlice.reducer;

function handleSignIn(state: UserState, action: PayloadAction<SignInPayload>) {
  localStore.putPrfsAccount(action.payload.prfsAccount, action.payload.walletAddr);

  state = {
    ...state,
    localPrfsAccount: {
      prfsAccount: action.payload.prfsAccount,
      walletAddr: action.payload.walletAddr,
    },
  };
}

function handleSignUp(state: UserState, action: PayloadAction<SignUpPayload>) {}

function handleLoadPrfsAccount(state: UserState, action: PayloadAction<LoadPrfsAccountPayload>) {
  return {
    ...state,
    localPrfsAccount: action.payload.localPrfsAccount,
  };
}

function handleSignOut(state: UserState, _action: PayloadAction<SignOutPayload>) {
  state.localPrfsAccount = undefined;
}
