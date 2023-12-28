import React from "react";

import styles from "./ContentArea.module.scss";

export const TopPlaceholder = () => {
  return <div className={styles.mastheadPlaceholder} />;
};

export interface ContentAreaProps {
  children: React.ReactNode;
}
