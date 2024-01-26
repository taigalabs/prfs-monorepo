"use client";

import React from "react";
import cn from "classnames";

import styles from "./DialogComponents.module.scss";

export const DefaultModalWrapper: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.modalWrapper, className)}>{children}</div>;
};

export const DefaultModalHeader: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.modalHeader, className)}>{children}</div>;
};

export const DefaultModalDesc: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.modalDesc, className)}>{children}</div>;
};

export const DefaultModalBtnRow: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.modalBtnRow, className)}>{children}</div>;
};

export interface AttestationsProps {
  children: React.ReactNode;
  className?: string;
}
