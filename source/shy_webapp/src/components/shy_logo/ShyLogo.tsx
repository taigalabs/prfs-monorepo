import React from "react";
import cn from "classnames";

import styles from "./ShyLogo.module.scss";

const ShyLogo: React.FC<ShyLogoProps> = ({ width, className }) => {
  return (
    <div className={cn(styles.wrapper, className)} style={{ width }}>
      <div className={styles.box}>
        <span>Shy</span>
      </div>
    </div>
  );
};

export default ShyLogo;

export interface ShyLogoProps {
  className?: string;
  width?: number | "auto";
}
