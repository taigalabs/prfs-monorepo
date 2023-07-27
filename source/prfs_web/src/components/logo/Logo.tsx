import React from "react";
import classNames from "classnames";

import styles from "./Logo.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Logo: React.FC<LogoProps> = ({ variant, className }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div
      className={classNames({
        [styles.simple]: variant === "simple",
        [styles.big]: variant === "big",
        [className]: true,
      })}
    >
      {i18n.prfs}
    </div>
  );
};

export default Logo;

export interface LogoProps {
  variant: "simple" | "big";
  className?: string;
}
