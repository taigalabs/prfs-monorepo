"use client";

import React from "react";

import styles from "./GlobalHeader.module.scss";
import ShyLogo from "../shy_logo/ShyLogo";

const GlobalHeader: React.FC<GlobalHeaderProps> = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <ShyLogo className={styles.logo} />
      </div>
      <div className={styles.placeholder} />
    </>
  );
};

export default GlobalHeader;

export interface GlobalHeaderProps {}
