import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { PrfsIdSignInSuccessPayload } from "@taigalabs/prfs-id-sdk-web";

export interface LocalPrfsProofAccount {
  id: string;
  publicKey: string;
}

export interface UserState {
  localPrfsAccount: LocalPrfsProofAccount | undefined;
}

const makeInitialState: () => UserState = () => {
  // loadLocalPrfsProofCredential();

  return {
    localPrfsAccount: undefined,
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: makeInitialState(),
  reducers: {
    signInPrfs: (state: UserState, _action: PayloadAction<PrfsIdSignInSuccessPayload>) => {
      return {
        ...state,
      };
    },
  },
});

export const { signInPrfs } = userSlice.actions;

export default userSlice.reducer;
