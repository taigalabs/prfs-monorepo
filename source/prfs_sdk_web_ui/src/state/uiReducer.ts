import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";

export interface UIState {}

const initialState: UIState = {};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setInnerPos: (state: UIState, action: PayloadAction<string>) => {
      // return handleSignIn(state, action);
    },
  },
});

export const { setInnerPos } = uiSlice.actions;

export default uiSlice.reducer;
