import { makeGlobalErrorSlice } from "@taigalabs/prfs-react-lib/src/global_error_reducer";

const slice = makeGlobalErrorSlice();

export const { setGlobalError, removeGlobalError } = slice.actions;

export const globalErrorReducer = slice.reducer;
