"use client";

import React from "react";

import en from "./en";

export const i18nContext = React.createContext(en);

export const PrfsReactComponentsI18NProvider = ({ children }: { children: React.ReactNode }) => {
  return <i18nContext.Provider value={en}>{children}</i18nContext.Provider>;
};
