import React from "react";

import styles from "./DefaultLayout.module.scss";

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const DefaultHeader: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className={styles.header}>{children}</div>;
};

export const DefaultMain: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className={styles.main}>{children}</div>;
};

export default DefaultLayout;

export interface DefaultLayoutProps {
  children: React.ReactNode;
}
