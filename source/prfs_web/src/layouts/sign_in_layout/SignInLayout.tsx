"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import Container from "@mui/material/Container";

import Logo from "@/components/logo/Logo";
import styles from "./SignInLayout.module.scss";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/leftbar/LeftBar";
import { i18nContext } from "@/contexts/i18n";

const SignInLayout: React.FC<SignInLayoutProps> = ({ children, title, desc }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.upper}>
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className={styles.title}>
          <div className={styles.label}>{title}</div>
          <div className={styles.desc} dangerouslySetInnerHTML={{ __html: desc }}></div>
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
  title: string;
  desc: string;
}
