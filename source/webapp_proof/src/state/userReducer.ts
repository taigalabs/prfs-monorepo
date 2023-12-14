import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { LocalPrfsProofCredential, loadLocalPrfsProofCredential } from "@/storage/local_storage";

export interface UserState {
  prfsProofCredential: LocalPrfsProofCredential | null;
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
    signInPrfs: (state: UserState, action: PayloadAction<LocalPrfsProofCredential>) => {
      return {
        ...state,
        prfsProofCredential: action.payload,
      };
    },
  },
});

export const { signInPrfs } = userSlice.actions;

export default userSlice.reducer;
