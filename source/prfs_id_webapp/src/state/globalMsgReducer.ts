import {
  makeGlobalMsgSlice,
  GlobalMsgState,
} from "@taigalabs/prfs-react-lib/src/global_msg_reducer";

const notice = `
  Prfs attestation has been upgraded to version 0.2. Those that have created the older\
  version (prior to 2024 Apr 03) should create an attestation again to continue to use it\
`;

const initialState: GlobalMsgState = {
  msg: {
    variant: "warn",
    message: notice,
    notOverlay: true,
  },
};

const slice = makeGlobalMsgSlice(initialState);

export const { setGlobalMsg, removeGlobalMsg } = slice.actions;

export const globalMsgReducer = slice.reducer;
