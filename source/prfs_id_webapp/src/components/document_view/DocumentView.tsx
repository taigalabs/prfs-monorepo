import React from "react";

import styles from "./DocumentView.module.scss";

const DocumentView: React.FC<DocumentViewProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
};

export default DocumentView;

export interface DocumentViewProps {
  children?: React.ReactNode;
}
