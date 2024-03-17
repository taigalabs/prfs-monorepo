import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { globalErrorReducer } from "@taigalabs/prfs-react-lib/src/global_error_reducer";

import { userReducer } from "./userReducer";
import { tutorialReducer } from "./tutorialReducer";
// import { errorReducer } from "./errorReducer";

const logger = createLogger({
  level: {
    prevState: false,
    nextState: false,
  },
});

export const store = configureStore({
  reducer: {
    user: userReducer,
    tutorial: tutorialReducer,
    globalError: globalErrorReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger) as any,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
