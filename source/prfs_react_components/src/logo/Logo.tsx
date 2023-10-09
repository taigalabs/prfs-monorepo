"use client";

import React from "react";
import classNames from "classnames";

import styles from "./Logo.module.scss";
import { i18nContext } from "../contexts/i18nContext";

const Logo: React.FC<LogoProps> = ({ variant, appName, beta }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <p
        className={classNames({
          [styles.simple]: variant === "simple",
          [styles.big]: variant === "big",
        })}
      >
        {i18n.prfs}
      </p>
      {appName && <p className={styles.appName}>{appName}</p>}
      {beta && <p className={styles.betaTag}>Beta</p>}
    </div>
  );
};

export default Logo;

export interface LogoProps {
  variant: "simple" | "big";
  appName?: string;
  beta?: boolean;
}
