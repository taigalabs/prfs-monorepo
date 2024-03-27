import React from "react";
import cn from "classnames";

import styles from "./IntroComponents.module.scss";

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
