import React from "react";

import { en } from "@taigalabs/prfs-i18n";

export const i18nContext = React.createContext(en);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <i18nContext.Provider value={en}>{children}</i18nContext.Provider>;
};
