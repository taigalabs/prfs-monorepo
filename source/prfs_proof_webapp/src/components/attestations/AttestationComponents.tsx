"use client";

import React from "react";
import cn from "classnames";

import styles from "./AttestationComponents.module.scss";
import { DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";

export const AttestationsDefaultBody: React.FC<AttestationsProps> = ({ children, className }) => {
  return (
    <DefaultBody noMinWidth className={cn(styles.defaultBody, className)}>
      {children}
    </DefaultBody>
  );
};

export const AttestationsHeader: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.header, className)}>{children}</div>;
};

export const AttestationsHeaderRow: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.headerRow, className)}>{children}</div>;
};

export const AttestationsTopMenu: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.topMenu, className)}>{children}</div>;
};

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
