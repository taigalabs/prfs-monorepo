import React from "react";

import styles from "./IntroComponents.module.scss";

export const Title: React.FC<TitleProps> = ({ children }) => {
  return <div className={styles.title}>{children}</div>;
};

export interface TitleProps {
  children: React.ReactNode;
}
