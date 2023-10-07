import React from "react";

import styles from "./DefaultLayout.module.scss";

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const DefaultBody: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className={styles.body}>{children}</div>;
};

export const DefaultFooter: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

export default DefaultLayout;

export interface DefaultLayoutProps {
  children: React.ReactNode;
}
