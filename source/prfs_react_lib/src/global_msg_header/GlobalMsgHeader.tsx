"use client";

import React from "react";
import cn from "classnames";

import styles from "./GlobalMsgHeader.module.scss";

const GlobalMsgHeader: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default GlobalMsgHeader;

export interface GlobalErrorDialogProps {
  children: React.ReactNode;
}
