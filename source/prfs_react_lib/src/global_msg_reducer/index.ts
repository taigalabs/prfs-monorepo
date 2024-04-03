import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GlobalMsgState {
  msg: GlobalMsg | null;
}

const initialState_: GlobalMsgState = {
  msg: null,
};

const makeSlice = (initialState: GlobalMsgState) =>
  createSlice({
    name: "global_msg",
    initialState,
    reducers: {
      setGlobalMsg: (state, action: PayloadAction<GlobalMsg>) => {
        // console.error("Reporting msg: %o", action);

        return {
          ...state,
          msg: action.payload,
        };
      },
      removeGlobalMsg: (state, _action: PayloadAction<void>) => {
        return {
          ...state,
          msg: null,
        };
      },
    },
  });

interface GlobalMsg {
  variant: "error" | "warn";
  message: string;
  notOverlay?: boolean;
  notDismissible?: boolean;
}

export function makeGlobalMsgSlice(initialState?: GlobalMsgState) {
  return makeSlice(initialState || initialState_);
}
