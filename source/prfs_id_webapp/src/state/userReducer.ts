import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

export interface UserState {
  isInitialized: boolean;
  prfsIdCredential: PrfsIdCredential | null;
}

const makeInitialState: () => UserState = () => {
  return {
    isInitialized: false,
    prfsIdCredential: null,
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: makeInitialState(),
  reducers: {
    signInPrfs: (state: UserState, action: PayloadAction<PrfsIdCredential | null>) => {
      return {
        ...state,
        isInitialized: true,
        prfsIdCredential: action.payload,
      };
    },
    signOutPrfs: (state: UserState, _action: PayloadAction<void>) => {
      return {
        ...state,
        prfsIdCredential: null,
      };
    },
  },
});

export const { signInPrfs, signOutPrfs } = userSlice.actions;

export default userSlice.reducer;
