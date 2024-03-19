import React from "react";
import cn from "classnames";

import styles from "./ErrorBox.module.scss";

export const ErrorBox: React.FC<ErrorBoxWrapperProps> = ({ children, className, rounded }) => {
  return (
    <div className={cn(styles.wrapper, className, { [styles.rounded]: rounded })}>{children}</div>
  );
};

export const ErrorBoxTitle: React.FC<ErrorBoxWrapperProps> = ({ children }) => {
  return <div className={styles.title}>{children}</div>;
};

export const ErrorBoxContent: React.FC<ErrorBoxWrapperProps> = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

export interface ErrorBoxWrapperProps {
  children: React.ReactNode;
  className?: string;
  rounded?: boolean;
}
