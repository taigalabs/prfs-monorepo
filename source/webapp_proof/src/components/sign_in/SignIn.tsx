"use client";

import React from "react";

import styles from "./SignIn.module.scss";
import { I18nProvider } from "@/contexts/i18n";
import SignInModule from "./SignInModule";

const SignIn: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <SignInModule />
    </div>
  );
};

export default SignIn;
