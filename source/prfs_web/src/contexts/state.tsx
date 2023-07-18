"use client";

import { Action } from "@/state/actions";
import React from "react";
import reducer, { AppState } from "@/state/reducer";

const initialState: AppState = {
  sig: undefined,
  id: undefined,
  walletAddr: undefined,
};

export const stateContext = React.createContext({
  state: initialState,
  dispatch: (_action: Action) => {},
});

export const StateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return <stateContext.Provider value={{ state, dispatch }}>{children}</stateContext.Provider>;
};
