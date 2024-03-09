import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import userReducer from "./userReducer";
import { globalMsgReducer } from "./globalMsgReducer";
import tutorialReducer from "./tutorialReducer";
import { globalErrorReducer } from "./globalErrorReducer";

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
    globalMsg: globalMsgReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger) as any,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
