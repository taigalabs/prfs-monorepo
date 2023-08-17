"use client";

import React from "react";

import styles from "./DefaultLayout.module.scss";
import { i18nContext } from "@/contexts/i18n";

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.wrapper}>{children}</div>;
};

export default DefaultLayout;

export interface DefaultLayoutProps {
  children: React.ReactNode;
}
