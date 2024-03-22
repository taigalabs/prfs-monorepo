import React from "react";
import cn from "classnames";

import styles from "./PLogo.module.scss";

const PLogo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <img
        src="https://d1w1533jipmvi2.cloudfront.net/logo_p_lato_192.png"
        alt="Prfs Id"
        crossOrigin=""
      />
    </div>
  );
};

export default PLogo;

export interface LogoProps {
  className?: string;
}
