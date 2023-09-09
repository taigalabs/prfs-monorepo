"use client";

import React from "react";
import Link from "next/link";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";

import styles from "./SignInLayout.module.scss";
import { i18nContext } from "@/contexts/i18n";

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.logoRow}>
          <Link href="/">
            <Logo variant="big" />
          </Link>
        </div>
        <div>{children}</div>
        <div className={styles.footer}>{i18n.copyright}</div>
      </div>
    </div>
  );
};

export default SignInLayout;

export interface SignInLayoutProps {
  children: React.ReactNode;
}
