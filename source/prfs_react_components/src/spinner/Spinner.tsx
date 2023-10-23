import React from "react";
import cn from "classnames";

import styles from "./Spinner.module.scss";

const Spinner: React.FC<SpinnerProps> = ({ color, size }) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className={styles.inner}
        style={{
          borderTopColor: color,
          borderBottomColor: color,
        }}
      />
    </div>
  );
};

export default Spinner;

export interface SpinnerProps {
  color?: string;
  size?: number;
}
