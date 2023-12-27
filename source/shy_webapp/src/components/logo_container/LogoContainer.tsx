import React from "react";
import cn from "classnames";

import styles from "./LogoContainer.module.scss";

const LogoContainer: React.FC<LogoContainerProps> = () => {
  return (
    <div className={cn(styles.wrapper)}>
      <img src="https://d1w1533jipmvi2.cloudfront.net/shy_logo_388.png" alt="logo" crossOrigin="" />
    </div>
  );
};

export default LogoContainer;

export interface LogoContainerProps {}
