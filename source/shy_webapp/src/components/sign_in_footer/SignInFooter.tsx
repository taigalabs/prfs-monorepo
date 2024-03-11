"use client";

import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./SignInFooter.module.scss";
import { envs } from "@/envs";

const SignInFooter: React.FC<SignInFooterProps> = () => {
  const i18n = usePrfsI18N();

  return (
    <ul className={styles.wrapper}>
      <li className={styles.commitHash}>{envs.NEXT_PUBLIC_GIT_COMMIT_HASH.substring(0, 6)}</li>
      <li>
        <a href="https://github.com/taigalabs/prfs-monorepo">{i18n.code}</a>
      </li>
      <li>
        <a href="https://www.taigalabs.xyz">{i18n.taigalabs}</a>
      </li>
    </ul>
  );
};

export default SignInFooter;

export interface SignInFooterProps {}
