import React from "react";
import cn from "classnames";

import styles from "./Spinner.module.scss";

const Spinner: React.FC<SpinnerProps> = ({ color, size, borderWidth }) => {
  return (
    <div className={styles.ldsRing} style={{ width: size, height: size }}>
      <div style={{ borderTopColor: color, borderWidth: borderWidth }} />
      <div style={{ borderTopColor: color, borderWidth: borderWidth }} />
      <div style={{ borderTopColor: color, borderWidth: borderWidth }} />
      <div style={{ borderTopColor: color, borderWidth: borderWidth }} />
    </div>
  );
};

export default Spinner;

export interface SpinnerProps {
  color?: string;
  size?: number;
  borderWidth?: number;
}
