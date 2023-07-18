import { useRouter } from "next/navigation";
import { Action } from "@/actions/actions";
import React from "react";
import { ActionInducer } from "@/actions/actionInducer";

const initialState: AppState = {
  color: "red"
};

export const stateContext = React.createContext({
  state: initialState,
  dispatch: (_action: Action) => { }
});

const reducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case "sign_in":
      return state;
    case "sign_up":
      return state;

    default:
      throw new Error("no action handler");
  }
};

export const StateProvider = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const asyncDispatch = React.useCallback((actionInducer: ActionInducer) => {
    actionInducer(dispatch, router).then();
  }, [router, dispatch]);

  return <stateContext.Provider value={{ state, dispatch: asyncDispatch }}>{children}</stateContext.Provider>;
};

export interface AppState {
  color: string;
}
