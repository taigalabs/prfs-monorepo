import React from "react";

import styles from "./Area.module.scss";

export const SpacedBetweenArea: React.FC<SpacedBetweenAreaProps> = ({ children }) => {
  return <div className={styles.spacedBetweenArea}>{children}</div>;
};

export interface SpacedBetweenAreaProps {
  children: React.ReactNode;
}
