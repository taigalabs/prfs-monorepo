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
    setMsg: (state, action: PayloadAction<GlobalMsg>) => {
      console.error("Set msg: %s", action.payload.message);

      return {
        ...state,
        msg: action.payload,
      };
    },
    removeMsg: (state, _action: PayloadAction<void>) => {
      return {
        ...state,
        msg: null,
      };
    },
  },
});

export const { setMsg, removeMsg } = globalMsgSlice.actions;

export const globalMsgReducer = globalMsgSlice.reducer;

interface GlobalMsg {
  message: string;
}
