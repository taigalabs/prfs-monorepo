"use client";

import React from "react";
import cn from "classnames";

import styles from "./AttestationComponents.module.scss";

export const AttestationsTitle: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.title, className)}>{children}</div>;
};

export const AttestationsMain: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.main, className)}>{children}</div>;
};

export const AttestationsMainInner: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.mainInner, className)}>{children}</div>;
};

export interface AttestationsProps {
  children: React.ReactNode;
  className?: string;
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}
