import React from "react";
import styles from "./IdLayout.module.scss";

const IdLayout: React.FC<IdLayoutProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const IdBody: React.FC<IdLayoutProps> = ({ children }) => {
  return <div className={styles.body}>{children}</div>;
};

export default IdLayout;

export interface IdLayoutProps {
  children: React.ReactNode;
}
