import {
  makeGlobalErrorSlice,
  GlobalErrorState,
} from "@taigalabs/prfs-react-lib/src/global_error_reducer";

const notice = `
  Prfs attestation has been upgraded to version 0.2. Those that have created the older\
  version (prior to 2024 Apr 03) should create an attestation again to continue to use it\
`;

const initialState: GlobalErrorState = {
  error: {
    message: notice,
    notOverlay: true,
  },
};

const slice = makeGlobalErrorSlice(initialState);

export const { setGlobalError, removeGlobalError } = slice.actions;

export const globalErrorReducer = slice.reducer;
