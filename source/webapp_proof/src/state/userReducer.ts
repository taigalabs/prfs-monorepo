import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { PrfsIdSignInSuccessPayload } from "@taigalabs/prfs-id-sdk-web";
import { loadLocalPrfsProofCredential } from "@/storage/local_storage";

export interface LocalPrfsProofAccount {
  id: string;
  publicKey: string;
}

export interface UserState {
  prfsProofCredential: LocalPrfsProofAccount | null;
}

const makeInitialState: () => UserState = () => {
  const prfsProofCredential = loadLocalPrfsProofCredential();

  return {
    prfsProofCredential,
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
