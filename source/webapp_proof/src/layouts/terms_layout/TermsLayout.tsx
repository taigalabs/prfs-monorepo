import React from "react";

import styles from "./TermsLayout.module.scss";

const TermsLayout: React.FC<TermsLayoutProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default TermsLayout;

export interface TermsLayoutProps {
  children: React.ReactNode;
}
