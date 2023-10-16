import React from "react";

import styles from "./Markdown.module.scss";

export const Markdown: React.FC<MarkdownComponentProps> = ({ children }) => {
  return <div className={styles.markdown}>{children}</div>;
};

export interface MarkdownComponentProps {
  children: React.ReactNode;
}
