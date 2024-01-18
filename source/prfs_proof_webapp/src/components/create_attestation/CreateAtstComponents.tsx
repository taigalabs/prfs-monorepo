import React from "react";
import cn from "classnames";

import styles from "./CreateAtstComponents.module.scss";
import { i18nContext } from "@/i18n/context";

export const ContentBox: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.contentBox, className)}>{children}</div>;
};

export const Btn: React.FC<BtnProps> = ({ children, className, handleClick }) => {
  return (
    <div className={cn(styles.btn, className)} onClick={handleClick}>
      {children}
    </div>
  );
};

export interface ContentBoxProps {
  children: React.ReactNode;
  className?: string;
}

export interface BtnProps {
  children: React.ReactNode;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  handleClick?: () => void;
}
