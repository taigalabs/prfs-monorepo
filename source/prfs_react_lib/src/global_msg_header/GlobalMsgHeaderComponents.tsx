"use client";

import React from "react";
import cn from "classnames";

import styles from "./GlobalMsgHeaderComponents.module.scss";

export const GlobalMsgHeaderWrapper: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export interface GlobalErrorDialogProps {
  children: React.ReactNode;
}
