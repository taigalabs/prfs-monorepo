"use client";

import React from "react";

import styles from "./DefaultLayout.module.scss";
import { useAppSelector } from "@/state/hooks";

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  let { top, left } = useAppSelector(state => state.ui.innerPos);
  // console.log(11, innerPos);

  return (
    <div
      className={styles.wrapper}
      style={{ position: "absolute", top: `${top}px`, left: `${left}px` }}
    >
      {children}
    </div>
  );
};

export default DefaultLayout;

export interface DefaultLayoutProps {
  children: React.ReactNode;
}
