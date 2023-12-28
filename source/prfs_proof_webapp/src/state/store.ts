import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import userReducer from "./userReducer";
import tutorialReducer from "./tutorialReducer";

const logger = createLogger({
  // level: {
  //   prevState: false,
  //   nextState: false,
  // },
});

export const store = configureStore({
  reducer: {
    user: userReducer,
    tutorial: tutorialReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger) as any,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
