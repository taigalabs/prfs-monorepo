"use client";

import React from "react";
import cn from "classnames";

import styles from "./AttestationComponents.module.scss";

export const AttestationsTitle: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.title, className)}>{children}</div>;
};

export const AttestationsMain: React.FC<AttestationsProps> = ({ children }) => {
  return <div className={styles.main}>{children}</div>;
};

export const AttestationsMainInner: React.FC<AttestationsProps> = ({ children }) => {
  return <div className={styles.mainInner}>{children}</div>;
};

export interface AttestationsProps {
  children: React.ReactNode;
  className?: string;
}
