import React from "react";

const initialState: AppState = {
  color: "red"
};

export const stateContext = React.createContext(
  { state: initialState, dispatch: (_action: any) => { } },
);

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "aa": return state;

    default:
      throw new Error("no action handler");
  }
}

export const StateProvider = ({ children }) => {
  const [state, dispatch]: [AppState, React.Dispatch<any>] =
    React.useReducer(reducer, [initialState]);

  return <stateContext.Provider value={{ state, dispatch }}>{children}</stateContext.Provider>;
};

export interface AppState {
  color: string;
}
