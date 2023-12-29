import React from "react";

import styles from "./DefaultLayout.module.scss";

export const DefaultLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const DefaultBody: React.FC<SignInLayoutProps> = ({ children }) => {
  return <div className={styles.body}>{children}</div>;
};

export interface SignInLayoutProps {
  children: React.ReactNode;
}
