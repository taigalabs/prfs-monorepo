import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";

export interface UIState {
  innerPos: {
    top: number;
    left: number;
  };
}

const initialState: UIState = {
  innerPos: {
    top: 0,
    left: 0,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setInnerPos: (state: UIState, action: PayloadAction<Position>) => {
      let { top, left } = action.payload;

      return {
        ...state,
        innerPos: { top, left },
      };
      // return handleSignIn(state, action);
    },
  },
});

export const { setInnerPos } = uiSlice.actions;

export default uiSlice.reducer;

export interface Position {
  top: number;
  left: number;
}
