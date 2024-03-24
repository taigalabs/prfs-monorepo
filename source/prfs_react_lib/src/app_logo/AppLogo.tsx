import React from "react";
import cn from "classnames";

import styles from "./AppLogo.module.scss";

const AppLogo: React.FC<LogoProps> = ({ className, width, imgUrl, alt }) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <img src={imgUrl} alt={alt ?? "Logo"} crossOrigin="" style={{ width }} />
    </div>
  );
};

export default AppLogo;

export interface LogoProps {
  className?: string;
  alt?: string;
  width?: number;
  imgUrl: string;
}
