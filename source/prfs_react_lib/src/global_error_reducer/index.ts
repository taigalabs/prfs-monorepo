import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GlobalErrorState {
  error: GlobalError | null;
}

const initialState_: GlobalErrorState = {
  error: null,
};

const makeSlice = (initialState: GlobalErrorState) =>
  createSlice({
    name: "error",
    initialState,
    reducers: {
      setGlobalError: (state, action: PayloadAction<GlobalError>) => {
        console.error("Reporting error: %o", action);

        return {
          ...state,
          error: action.payload,
        };
      },
      removeGlobalError: (state, _action: PayloadAction<void>) => {
        return {
          ...state,
          error: null,
        };
      },
    },
  });

interface GlobalError {
  message: string;
  notOverlay?: boolean;
  notDismissible?: boolean;
}

export function makeGlobalErrorSlice(initialState?: GlobalErrorState) {
  return makeSlice(initialState || initialState_);
}
