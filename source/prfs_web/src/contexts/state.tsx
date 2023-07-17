import { Action } from "@/actions/actions";
import React from "react";

const initialState: AppState = {
  color: "red"
};

export const stateContext = React.createContext({
  state: initialState,
  dispatch: (_action: Action) => {}
});

const reducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case "sign_in":
      return state;

    default:
      throw new Error("no action handler");
  }
};

export const StateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return <stateContext.Provider value={{ state, dispatch }}>{children}</stateContext.Provider>;
};

export interface AppState {
  color: string;
}
