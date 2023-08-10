import React from "react";

import en from "@/i18n/en";

export const i18nContext = React.createContext(en);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  return <i18nContext.Provider value={en}>{children}</i18nContext.Provider>;
};
