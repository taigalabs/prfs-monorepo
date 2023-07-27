"use client";

import React from "react";
import Link from "next/link";

import Logo from "@/components/logo/Logo";
import styles from "./SignInLayout.module.scss";
import { i18nContext } from "@/contexts/i18n";

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.logoRow}>
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {/* <div className={styles.title}> */}
        {/*   <div className={styles.label}>{title}</div> */}
        {/*   <div className={styles.desc} dangerouslySetInnerHTML={{ __html: desc }}></div> */}
        {/* </div> */}
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
