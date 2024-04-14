import React from "react";
import cn from "classnames";

import styles from "./ShyLogo.module.scss";
import { ubuntu } from "@/fonts";

const ShyLogo: React.FC<ShyLogoProps> = ({ width, className, noUpperPadding, textClassName }) => {
  return (
    <div className={cn(styles.wrapper, className)} style={{ width }}>
      {!noUpperPadding && <div className={cn(styles.paddingBox, styles.upperBox)} />}
      <div className={styles.box}>
        <span className={cn(ubuntu.className, styles.text, textClassName)}>Shy</span>
      </div>
      <div className={styles.paddingBox} />
    </div>
  );
};

export default ShyLogo;

export interface ShyLogoProps {
  className?: string;
  width?: number | "auto";
  noUpperPadding?: boolean;
  textClassName?: string;
}
