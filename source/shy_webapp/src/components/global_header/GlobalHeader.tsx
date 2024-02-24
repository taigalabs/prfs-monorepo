"use client";

import React from "react";

import styles from "./GlobalHeader.module.scss";
import ShyLogo from "@/components/shy_logo/ShyLogo";
import ShySignInBtn from "@/components/shy_sign_in_btn/ShySignInBtn";
import { paths } from "@/paths";

export const GlobalHeaderPlaceholder = () => {
  return <div className={styles.placeholder} />;
};

const GlobalHeader: React.FC<GlobalHeaderProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <a href={paths.__}>
            <ShyLogo className={styles.logo} />
          </a>
        </div>
        <div className={styles.rightGroup}>
          <ShySignInBtn noSignInBtn />
        </div>
      </div>
    </div>
  );
};

export default GlobalHeader;

export interface GlobalHeaderProps {}
