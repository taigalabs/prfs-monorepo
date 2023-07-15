"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import styles from "./DefaultLayout.module.scss";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/leftbar/LeftBar";
import { I18nContext } from "@/contexts";

const DefaultLayout: React.FC<any> = ({ children }) => {
  const i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <Masthead />
      <div className={styles.bottom}>
        <LeftBar />
        <div className={styles.right}>{children}</div>
      </div>
    </div>
  );
};

export default DefaultLayout;
