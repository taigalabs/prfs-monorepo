import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// import { LoadPrfsAccountPayload, SignInPayload, SignOutPayload, SignUpPayload } from "./actions";
// import { RootState } from "./store";

export interface TutorialState {
  tutorialStep: number;
}

const initialState: TutorialState = {
  tutorialStep: 1,
};

export const tutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  reducers: {
    goNextStep: (state: TutorialState, _action: PayloadAction<void>) => {
      return {
        ...state,
        tutorialStep: state.tutorialStep + 1,
      };
    },
  },
});

export const { goNextStep } = tutorialSlice.actions;

export default tutorialSlice.reducer;
