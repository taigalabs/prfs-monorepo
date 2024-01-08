import React from "react";
import cn from "classnames";

import styles from "./ShyLogo.module.scss";

const ShyLogo: React.FC<ShyLogoProps> = ({ width, className }) => {
  return (
    <div className={cn(styles.wrapper, className)} style={{ width }}>
      <img src="https://d1w1533jipmvi2.cloudfront.net/shy_logo_388.png" alt="logo" crossOrigin="" />
    </div>
  );
};

export default ShyLogo;

export interface ShyLogoProps {
  className?: string;
  width?: number | "auto";
}
