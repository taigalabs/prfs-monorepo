import React from "react";

import styles from "./TutorialPlaceholder.module.scss";

const MarkdownWrapper: React.FC<MarkdownWrapperProps> = () => {
  return <div className={styles.wrapper}></div>;
};

export default MarkdownWrapper;

export interface MarkdownWrapperProps {}
