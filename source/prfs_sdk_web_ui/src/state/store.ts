import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import uiReducer from "./uiReducer";

const logger = createLogger({
  // level: {
  //   prevState: false,
  //   nextState: false,
  // },
});

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
