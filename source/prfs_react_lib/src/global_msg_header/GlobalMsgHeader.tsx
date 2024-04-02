"use client";

import React from "react";
import cn from "classnames";

import styles from "./GlobalMsgHeader.module.scss";
// import Alert from "../alert/Alert";

export const GlobalMsgHeaderWrapper: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

// export const GlobalMsgHeaderContent: React.FC<GlobalErrorDialogProps> = ({ children }) => {
//   return <div className={styles.content}>{children}</div>;
// };

// export const GlobalMsgHeaderBtnGroup: React.FC<GlobalErrorDialogProps> = ({ children }) => {
//   return <div className={styles.btnGroup}>{children}</div>;
// };

export interface GlobalErrorDialogProps {
  children: React.ReactNode;
}
