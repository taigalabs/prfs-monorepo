"use client";

import React from "react";

import styles from "./GlobalHeader.module.scss";
import ShyLogo from "@/components/shy_logo/ShyLogo";

export const GlobalHeaderPlaceholder = () => {
  return <div className={styles.placeholder} />;
};

const GlobalHeader: React.FC<GlobalHeaderProps> = () => {
  return (
    <div className={styles.wrapper}>
      <ShyLogo className={styles.logo} />
    </div>
  );
};

export default GlobalHeader;

export interface GlobalHeaderProps {}
