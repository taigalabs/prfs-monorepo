import React from "react";

import styles from "./TutorialMarkdown.module.scss";

const TutorialMarkdown: React.FC<MarkdownWrapperProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default TutorialMarkdown;

export interface MarkdownWrapperProps {
  children: React.ReactNode;
}
