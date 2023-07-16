"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import Container from "@mui/material/Container";

import Logo from "@/components/logo/Logo";
import styles from "./SignInLayout.module.scss";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/leftbar/LeftBar";
import { I18nContext } from "@/contexts";

const DefaultLayout: React.FC<any> = ({ children }) => {
  const i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.upper}>
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {children}
        <div className={styles.footer}>sign in Footer</div>
      </div>
    </div>
  );
};

export default DefaultLayout;
