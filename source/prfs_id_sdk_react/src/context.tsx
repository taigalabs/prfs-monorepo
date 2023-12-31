import React from "react";

export const prfsEmbedContext = React.createContext({});

export const PrfsEmbedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // return <i18nContext.Provider value={en}>{children}</i18nContext.Provider>;
  const [childRef, setChildRef] = React.useState();
  React.useEffect(() => {}, []);
  return <>{children}</>;
};
