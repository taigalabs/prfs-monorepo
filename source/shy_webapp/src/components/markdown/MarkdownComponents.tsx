import React from "react";

import styles from "./MarkdownComponents.module.scss";

export const MarkdownWrapper: React.FC<MarkdownWrapperProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export interface MarkdownWrapperProps {
  children: React.ReactNode;
}
