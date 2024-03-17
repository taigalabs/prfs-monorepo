"use client";

import React from "react";

import styles from "./GlobalHeader.module.scss";
import ShyLogo from "@/components/shy_logo/ShyLogo";
import ShySignInBtn from "@/components/shy_sign_in_btn/ShySignInBtn";
import { paths } from "@/paths";
import { envs } from "@/envs";

export const GlobalHeaderPlaceholder = () => {
  return <div className={styles.placeholder} />;
};

const GlobalHeader: React.FC<GlobalHeaderProps> = () => {
  const hash = React.useMemo(() => {
    if (envs.NEXT_PUBLIC_GIT_COMMIT_HASH) {
      return envs.NEXT_PUBLIC_GIT_COMMIT_HASH.substring(0, 6);
    } else return "";
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <a href={paths.__}>
            <ShyLogo className={styles.logo} />
          </a>
          <p className={styles.gitHash}>{hash}</p>
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
