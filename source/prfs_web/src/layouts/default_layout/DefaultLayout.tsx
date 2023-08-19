"use client";

import React from "react";

import styles from "./DefaultLayout.module.scss";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/left_bar/LeftBar";
import { i18nContext } from "@/contexts/i18n";

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <Masthead />
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.leftBarContainer}>
            <LeftBar />
          </div>
          <div className={styles.contentArea}>
            <div>{children}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;

export interface DefaultLayoutProps {
  children: React.ReactNode;
}
