import React from "react";
import cn from "classnames";

import styles from "./ShyLogo.module.scss";

const ShyLogo: React.FC<ShyLogoProps> = ({ width, className }) => {
  return (
    <div className={cn(styles.wrapper, className)} style={{ width }}>
      <div className={cn(styles.paddingBox, styles.upperBox)} />
      <div className={styles.box}>
        <span>Shy</span>
      </div>
      <div className={styles.paddingBox} />
    </div>
  );
};

export default ShyLogo;

export interface ShyLogoProps {
  className?: string;
  width?: number | "auto";
}
