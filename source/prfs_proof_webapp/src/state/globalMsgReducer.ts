import {
  GlobalMsgState,
  makeGlobalMsgSlice,
} from "@taigalabs/prfs-react-lib/src/global_msg_reducer";

// const _initialState: GlobalMsgState = {
//   msg: {
//     variant: "error",
//     message: "power",
//   },
// };

const slice = makeGlobalMsgSlice(undefined);

export const { setGlobalMsg, removeGlobalMsg } = slice.actions;

export const globalMsgReducer = slice.reducer;
