import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
    goPrevStep: (state: TutorialState, _action: PayloadAction<void>) => {
      return {
        ...state,
        tutorialStep: state.tutorialStep - 1,
      };
    },
  },
});

export const { goNextStep, goPrevStep } = tutorialSlice.actions;

export default tutorialSlice.reducer;
