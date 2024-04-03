import { makeGlobalMsgSlice } from "@taigalabs/prfs-react-lib/src/global_msg_reducer";

const slice = makeGlobalMsgSlice();

export const { setGlobalMsg, removeGlobalMsg } = slice.actions;

export const globalMsgReducer = slice.reducer;
