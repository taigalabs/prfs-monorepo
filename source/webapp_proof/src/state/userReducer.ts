import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { LocalPrfsProofCredential } from "@/storage/local_storage";

export interface UserState {
  prfsProofCredential: LocalPrfsProofCredential | null;
}

const makeInitialState: () => UserState = () => {
  return {
    prfsProofCredential: null,
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: makeInitialState(),
  reducers: {
    signInPrfs: (state: UserState, action: PayloadAction<LocalPrfsProofCredential>) => {
      return {
        ...state,
        prfsProofCredential: action.payload,
      };
    },
    signOutPrfs: (state: UserState, _action: PayloadAction<void>) => {
      return {
        ...state,
        prfsProofCredential: null,
      };
    },
  },
});

export const { signInPrfs, signOutPrfs } = userSlice.actions;

export default userSlice.reducer;
