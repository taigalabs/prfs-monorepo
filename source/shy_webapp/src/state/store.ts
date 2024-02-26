import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import { userReducer } from "./userReducer";
import { errorReducer } from "./errorReducer";

const logger = createLogger({
  level: {
    prevState: false,
    nextState: false,
  },
});

export const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
