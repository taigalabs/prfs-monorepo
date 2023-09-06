// import React from "react";

// import { Action } from "@/state/actions";
// import reducer, { AppState } from "@/state/reducer";

// const initialState: AppState = {
//   localPrfsAccount: undefined,
// };

// export const stateContext = React.createContext({
//   state: initialState,
//   dispatch: (_action: Action) => {},
// });

// export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [state, dispatch] = React.useReducer(reducer, initialState);

//   return <stateContext.Provider value={{ state, dispatch }}>{children}</stateContext.Provider>;
// };
