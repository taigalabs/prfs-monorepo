import React from "react";
import classNames from "classnames";

import styles from "./Logo.module.scss";

const Logo: React.FC<LogoProps> = ({ variant }) => {
  return (
    <div
      className={classNames({
        [styles.simple]: variant === "simple",
        [styles.big]: variant === "big",
      })}
    >
      Prfs
    </div>
  );
};

export default Logo;

export interface LogoProps {
  variant: "simple" | "big";
}
