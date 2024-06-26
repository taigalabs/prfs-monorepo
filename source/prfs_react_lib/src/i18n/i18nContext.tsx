import React from "react";

import { en } from "@taigalabs/prfs-i18n";

export const i18nContext = React.createContext(en);

export const PrfsReactComponentsI18NProvider = ({ children }: { children: React.ReactNode }) => {
  return <i18nContext.Provider value={en}>{children}</i18nContext.Provider>;
};

export function usePrfsReactI18N() {
  return React.useContext(i18nContext);
}
