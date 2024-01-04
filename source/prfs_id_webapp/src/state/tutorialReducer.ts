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
    resetStep: (state: TutorialState, _action: PayloadAction<void>) => {
      return {
        ...state,
        tutorialStep: 1,
      };
    },
    goToStep: (state: TutorialState, action: PayloadAction<number>) => {
      return {
        ...state,
        tutorialStep: action.payload,
      };
    },
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

export const { goToStep, goNextStep, goPrevStep, resetStep } = tutorialSlice.actions;

export default tutorialSlice.reducer;
