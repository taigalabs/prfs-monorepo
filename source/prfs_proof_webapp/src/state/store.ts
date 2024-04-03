import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import { globalMsgReducer } from "./globalMsgReducer";
import { userReducer } from "./userReducer";

const logger = createLogger({
  level: {
    prevState: false,
    nextState: false,
  },
});

export const store = configureStore({
  reducer: {
    user: userReducer,
    globalMsg: globalMsgReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger) as any,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
