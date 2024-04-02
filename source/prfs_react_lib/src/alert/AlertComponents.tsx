"use client";

import React from "react";
import cn from "classnames";
import { IoMdAlert } from "@react-icons/all-files/io/IoMdAlert";
// import { IoWarningOutline } from "@react-icons/all-files/io5/IoWarningOutline";

import styles from "./AlertComponents.module.scss";

export const AlertWrapper: React.FC<AlertProps> = ({ children, variant, rounded }) => {
  return (
    <div
      className={cn(styles.wrapper, {
        [styles.warn]: variant === "warn",
        [styles.error]: variant === "error",
        [styles.rounded]: rounded,
      })}
    >
      <IoMdAlert className={styles.img} />
      {children}
    </div>
  );
};

export const AlertContent: React.FC<AlertBtnGroupProps> = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

export const AlertBtnGroup: React.FC<AlertBtnGroupProps> = ({ children }) => {
  return <div className={styles.btnGroup}>{children}</div>;
};

export interface AlertProps {
  children: React.ReactNode;
  variant: "error" | "warn";
  rounded?: boolean;
}

export interface AlertBtnGroupProps {
  children: React.ReactNode;
}
