import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UIState {
  innerOpacity: number;
  innerPos: {
    top: number;
    left: number;
  };
}

const initialState: UIState = {
  innerOpacity: 1,
  innerPos: {
    top: 0,
    left: 0,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setInnerOpacity: (state: UIState, action: PayloadAction<number>) => {
      return {
        ...state,
        innerOpacity: action.payload,
      };
    },
    setInnerPos: (state: UIState, action: PayloadAction<Position>) => {
      let { top, left } = action.payload;

      return {
        ...state,
        innerPos: { top, left },
      };
    },
  },
});

export const { setInnerPos, setInnerOpacity } = uiSlice.actions;

export default uiSlice.reducer;

export interface Position {
  top: number;
  left: number;
}
