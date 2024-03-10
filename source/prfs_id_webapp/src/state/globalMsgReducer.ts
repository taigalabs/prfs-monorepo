import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GlobalMsgState {
  msg: GlobalMsg | null;
}

const initialState: GlobalMsgState = {
  msg: null,
};

const globalMsgSlice = createSlice({
  name: "globalMsg",
  initialState,
  reducers: {
    setGlobalMsg: (state, action: PayloadAction<GlobalMsg>) => {
      console.error("Set msg: %s", action.payload.message);

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

export const { setGlobalMsg, removeGlobalMsg } = globalMsgSlice.actions;

export const globalMsgReducer = globalMsgSlice.reducer;

interface GlobalMsg {
  message: string;
  notDismissible?: boolean;
}
