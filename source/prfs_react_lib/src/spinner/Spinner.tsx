import React from "react";
import cn from "classnames";

import styles from "./Spinner.module.scss";

const Spinner: React.FC<SpinnerProps> = ({ size, color, className }) => {
  return (
    <div
      className={cn(styles.loader, className, {
        [styles.gray_1]: styles.gray_1,
      })}
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        borderBottomColor: color,
        borderRightColor: color,
      }}
    />
  );
};

export default Spinner;

export interface SpinnerProps {
  color?: string;
  size?: number;
  borderWidth?: number;
  className?: string;
  variant?: "gray_1";
}
