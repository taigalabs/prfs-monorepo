import React from "react";

import styles from "./StrikeThroughText.module.scss";

const StrikeThroughText: React.FC<StrikeThroughTextProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <span>{children}</span>
    </div>
  );
};

export default StrikeThroughText;

export interface StrikeThroughTextProps {
  children: React.ReactNode;
}
