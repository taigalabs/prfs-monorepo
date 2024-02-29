"use client";

import React from "react";
import cn from "classnames";

import styles from "./GlobalErrorDialog.module.scss";

export const GlobalErrorDialogWrapper: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const GlobalErrorDialogContent: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

export const GlobalErrorDialogBtnGroup: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.btnGroup}>{children}</div>;
};

export interface GlobalErrorDialogProps {
  children: React.ReactNode;
}
