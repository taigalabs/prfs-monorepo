"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import styles from "./SignInLayout.module.scss";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/leftbar/LeftBar";
import { I18nContext } from "@/contexts";

const DefaultLayout: React.FC<any> = ({ children }) => {
  const i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <div>{children}</div>
    </div>
  );
};

export default DefaultLayout;
