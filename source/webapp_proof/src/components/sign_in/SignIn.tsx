"use client";

import React from "react";

import styles from "./SignIn.module.scss";
import { I18nProvider } from "@/contexts/i18n";

const SignInModule = () => {
  return <div>123</div>;
};

const SignIn: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <SignInModule />
    </div>
  );
};

export default SignIn;
