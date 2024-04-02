import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const notice = `
  Prfs attestation has been upgraded to version 0.2. Those that have created the older\
  version (prior to 2024 Apr 03) should create an attestation again to continue to use it\
`;

export interface GlobalMsgState {
  msg: GlobalMsg | null;
}

const initialState: GlobalMsgState = {
  msg: {
    message: notice,
    notOverlay: true,
  },
};

const globalMsgSlice = createSlice({
  name: "globalMsg",
  initialState,
  reducers: {
    setGlobalMsg: (state, action: PayloadAction<GlobalMsg>) => {
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
  notOverlay?: boolean;
  notDismissible?: boolean;
}
