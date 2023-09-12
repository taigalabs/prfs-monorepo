import React from "react";

import styles from "./ContentArea.module.scss";

const ContentArea: React.FC<ContentAreaProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const TopPlaceholder = () => {
  return <div className={styles.mastheadPlaceholder} />;
};

export default ContentArea;

export interface ContentAreaProps {
  children: React.ReactNode;
}
