import React from "react";
import cn from "classnames";

import styles from "./AppComponents.module.scss";
import { DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";

export const AppDefaultBody: React.FC<AttestationsProps> = ({ children, className }) => {
  return (
    <DefaultBody className={cn(styles.defaultBody, className)} noMinWidth overflowYHidden>
      {children}
    </DefaultBody>
  );
};

export const AppHeader: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.header, className)}>{children}</div>;
};

export const AppHeaderRow: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.headerRow, className)}>{children}</div>;
};

export const AppTopMenu: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.topMenu, className)}>{children}</div>;
};

export const AppTitle: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.title, className)}>{children}</div>;
};

export const AppMain: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.main, className)}>{children}</div>;
};

export const AppMainInner: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.mainInner, className)}>{children}</div>;
};

export interface AttestationsProps {
  children: React.ReactNode;
  className?: string;
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}
