import React from "react";
import cn from "classnames";

import styles from "./ShyLogo.module.scss";

const ShyLogo: React.FC<ShyLogoProps> = ({ width, className }) => {
  return (
    <div className={cn(styles.wrapper, className)} style={{ width }}>
      <span>Shy</span>
      {/* <img src="https://d1w1533jipmvi2.cloudfront.net/shy_logo_388.png" alt="logo" crossOrigin="" /> */}
    </div>
  );
};

export default ShyLogo;

export interface ShyLogoProps {
  className?: string;
  width?: number | "auto";
}
