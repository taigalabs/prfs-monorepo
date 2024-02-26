import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ErrorState {
  error: string | null;
}

const initialState: ErrorState = {
  error: null,
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    reportError: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        error: action.payload,
      };
    },
    removeError: (state, _action: PayloadAction<void>) => {
      return {
        ...state,
        error: null,
      };
    },
  },
});

export const { reportError, removeError } = errorSlice.actions;

export const errorReducer = errorSlice.reducer;
