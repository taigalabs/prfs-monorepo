import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { LocalShyCredential } from "@/storage/local_storage";

export interface UserState {
  isInitialized: boolean;
  shyCredential: LocalShyCredential | null;
}

const makeInitialState: () => UserState = () => {
  return {
    isInitialized: false,
    shyCredential: null,
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: makeInitialState(),
  reducers: {
    signInPrfs: (state: UserState, action: PayloadAction<LocalShyCredential | null>) => {
      return {
        ...state,
        isInitialized: true,
        shyCredential: action.payload,
      };
    },
    signOutPrfs: (state: UserState, _action: PayloadAction<void>) => {
      return {
        ...state,
        shyCredential: null,
      };
    },
  },
});

export const { signInPrfs, signOutPrfs } = userSlice.actions;

export default userSlice.reducer;
