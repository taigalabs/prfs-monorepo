"use client";

import React from "react";
import cn from "classnames";

import styles from "./GlobalMsgHeader.module.scss";

export const GlobalMsgHeaderWrapper: React.FC<GlobalMsgHeaderWrapperProps> = ({
  children,
  variant,
}) => {
  return (
    <div
      className={cn(styles.wrapper, {
        [styles.warn]: variant === "warn",
        [styles.error]: variant === "error",
      })}
    >
      {children}
    </div>
  );
};

export const GlobalMsgHeaderContent: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

export const GlobalMsgHeaderBtnGroup: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.btnGroup}>{children}</div>;
};

export interface GlobalErrorDialogProps {
  children: React.ReactNode;
}

export interface GlobalMsgHeaderWrapperProps {
  children: React.ReactNode;
  variant: "error" | "warn";
}
