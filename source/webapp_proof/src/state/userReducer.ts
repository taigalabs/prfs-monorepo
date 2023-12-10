import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// import { LoadPrfsAccountPayload, SignInPayload, SignOutPayload, SignUpPayload } from "./actions";
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
    signInPrfs: (state: UserState, _action: PayloadAction<void>) => {
      return {
        ...state,
      };
    },
  },
});

// export const {  } = userSlice.actions;

export default userSlice.reducer;
