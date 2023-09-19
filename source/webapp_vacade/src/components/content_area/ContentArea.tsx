import React from "react";

import styles from "./ContentArea.module.scss";

export const ContentMain: React.FC<ContentAreaProps> = ({ children }) => {
  return <div className={styles.contentMain}>{children}</div>;
};

export const ContentLeft: React.FC<ContentAreaProps> = ({ children }) => {
  return <div className={styles.contentLeft}>{children}</div>;
};

export const ContentMainCenter: React.FC<ContentAreaProps> = ({ children }) => {
  return <div className={styles.contentMainCenter}>{children}</div>;
};

export const TopPlaceholder = () => {
  return <div className={styles.mastheadPlaceholder} />;
};

export interface ContentAreaProps {
  children: React.ReactNode;
}
