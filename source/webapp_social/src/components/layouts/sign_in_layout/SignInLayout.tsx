"use client";

import React from "react";
import styles from "./SignInLayout.module.scss";

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default SignInLayout;

export interface SignInLayoutProps {
  children: React.ReactNode;
}
