import React from "react";

const store = {};

export const stateContext = React.createContext(store);

export const StateProvider = ({ children }) => {
  return <stateContext.Provider value={store}>{children}</stateContext.Provider>;
};
