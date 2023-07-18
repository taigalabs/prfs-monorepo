"use client";

import React from "react";

import { Action } from "@/state/actions";
import reducer, { AppState } from "@/state/reducer";
import localStorage from "@/storage/localStorage";

const initialState: AppState = {
  prfsAccount: undefined,
};

export const stateContext = React.createContext({
  state: initialState,
  dispatch: (_action: Action) => {},
});

export const StateProvider = ({ children }) => {
  // let prfsAccount = localStorage.getPrfsAccount();

  // let iState: AppState;
  // if (prfsAccount !== null) {
  //   iState = {
  //     sig: prfsAccount.sig,
  //     id: prfsAccount.id,
  //     walletAddr: prfsAccount.walletAddr,
  //   };
  // } else {
  //   iState = initialState;
  // }

  // console.log("initial state: %o", initialState);

  const [state, dispatch] = React.useReducer(reducer, initialState);

  return <stateContext.Provider value={{ state, dispatch }}>{children}</stateContext.Provider>;
};
