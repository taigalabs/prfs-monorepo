import React from "react";
import cn from "classnames";

import styles from "./Spinner.module.scss";

const Spinner: React.FC<SpinnerProps> = ({ size, color, className }) => {
  return (
    <div
      className={cn(styles.loader, className)}
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

// const Spinner2: React.FC<SpinnerProps> = ({ color, size, borderWidth, className }) => {
//   return (
//     <div className={cn(styles.ldsRing, className)} style={{ width: size, height: size }}>
//       <div style={{ borderTopColor: color, borderWidth: borderWidth }} />
//       <div style={{ borderTopColor: color, borderWidth: borderWidth }} />
//       <div style={{ borderTopColor: color, borderWidth: borderWidth }} />
//       <div style={{ borderTopColor: color, borderWidth: borderWidth }} />
//     </div>
//   );
// };

export default Spinner;

export interface SpinnerProps {
  color?: string;
  size?: number;
  borderWidth?: number;
  className?: string;
}