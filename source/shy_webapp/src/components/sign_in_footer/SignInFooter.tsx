"use client";

import React from "react";

import styles from "./SignInFooter.module.scss";
import { paths } from "@/paths";
import { useI18N } from "@/i18n/context";

const SignInFooter: React.FC<SignInFooterProps> = () => {
  const i18n = useI18N();

  return (
    <ul className={styles.wrapper}>
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
