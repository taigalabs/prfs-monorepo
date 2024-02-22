"use client";

import React from "react";

import styles from "./GlobalHeader.module.scss";
import ShyLogo from "@/components/shy_logo/ShyLogo";
import PrfsIdSignInBtn from "@/components/prfs_sign_in_btn/PrfsSignInBtn";

export const GlobalHeaderPlaceholder = () => {
  return <div className={styles.placeholder} />;
};

const GlobalHeader: React.FC<GlobalHeaderProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftGroup}>
        <ShyLogo className={styles.logo} />
      </div>
      <div className={styles.rightGroup}>
        <PrfsIdSignInBtn />
      </div>
    </div>
  );
};

export default GlobalHeader;

export interface GlobalHeaderProps {}
