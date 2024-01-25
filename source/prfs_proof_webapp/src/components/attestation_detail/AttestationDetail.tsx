import React from "react";
import cn from "classnames";

import styles from "./AttestationDetail.module.scss";

export const AttestationDetailTopMenuRow: React.FC<AttestationDetailProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.topMenuRow, className)}>{children}</div>;
};

export const AttestationDetailBox: React.FC<AttestationDetailProps> = ({ children, className }) => {
  return <div className={cn(styles.box, className)}>{children}</div>;
};

export const AttestationDetailBoxInner: React.FC<AttestationDetailProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.boxInner, className)}>{children}</div>;
};

export const AttestationDetailSection: React.FC<AttestationDetailProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.section, className)}>{children}</div>;
};

export const AttestationDetailSectionRow: React.FC<AttestationDetailProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.sectionRow, className)}>{children}</div>;
};

export const AttestationDetailSectionRowLabel: React.FC<AttestationDetailProps> = ({
  children,
  className,
}) => {
  return <p className={cn(styles.sectionRowLabel, className)}>{children}</p>;
};

export interface AttestationDetailProps {
  children: React.ReactNode;
  className?: string;
}
