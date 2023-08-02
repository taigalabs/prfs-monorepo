"use client";

import React from "react";

import { Action } from "@/state/actions";
import reducer, { AppState } from "@/state/reducer";

const initialState: AppState = {
  prfsAccount: undefined,
};

export const stateContext = React.createContext({
  state: initialState,
  dispatch: (_action: Action) => {},
});

export const StateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return <stateContext.Provider value={{ state, dispatch }}>{children}</stateContext.Provider>;
};
