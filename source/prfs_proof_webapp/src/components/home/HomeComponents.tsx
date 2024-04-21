import React from "react";
import cn from "classnames";

import styles from "./HomeComponents.module.scss";

export const HomeInner: React.FC<TitleProps> = ({ children, className }) => {
  return <div className={cn(styles.inner, className)}>{children}</div>;
};

export const Area: React.FC<TitleProps> = ({ children, className }) => {
  return <div className={cn(styles.area, className)}>{children}</div>;
};

export const Title: React.FC<TitleProps> = ({ children, className }) => {
  return <div className={cn(styles.title, className)}>{children}</div>;
};

export const Subtitle: React.FC<TitleProps> = ({ children, className }) => {
  return <div className={cn(styles.subtitle, className)}>{children}</div>;
};

export interface TitleProps {
  className?: string;
  children: React.ReactNode;
}
