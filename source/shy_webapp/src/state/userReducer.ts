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
    signInShy: (state: UserState, action: PayloadAction<LocalShyCredential | null>) => {
      return {
        ...state,
        isInitialized: true,
        shyCredential: action.payload,
      };
    },
    signOutShy: (state: UserState, _action: PayloadAction<void>) => {
      return {
        ...state,
        shyCredential: null,
      };
    },
  },
});

export const { signInShy, signOutShy } = userSlice.actions;

export const userReducer = userSlice.reducer;
