"use client";

import React, { Suspense } from "react";

import styles from "./SignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import { ContentLeft, ContentMain } from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
import LogoContainer from "../logo_container/LogoContainer";
import ShyLandingIntro from "./ShyLandingIntro.mdx";

const SignIn: React.FC<SignInProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logoPane}>
        <LogoContainer />
      </div>
      <div className={styles.main}>
        <ShyLandingIntro />
      </div>
    </div>
  );
};

export default SignIn;

export interface SignInProps {}
