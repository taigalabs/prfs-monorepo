"use client";

import React from "react";
import cn from "classnames";

import styles from "./GlobalMsgHeaderComponents.module.scss";

export const GlobalMsgHeaderWrapper: React.FC<GlobalErrorDialogProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.wrapper, className)}>{children}</div>;
};

export interface GlobalErrorDialogProps {
  children: React.ReactNode;
  className?: string;
}
