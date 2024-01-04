"use client";

import React from "react";
import cn from "classnames";

import styles from "./Masthead.module.scss";

export const MastheadWrapper: React.FC<MastheadWrapperProps> = ({
  children,
  className,
  twoColumn,
  tallHeight,
  smallPadding,
}) => {
  return (
    <div
      className={cn(styles.wrapper, className, {
        [styles.twoColumn]: twoColumn,
        [styles.smallPadding]: smallPadding,
        [styles.tallHeight]: tallHeight,
      })}
    >
      {children}
    </div>
  );
};

export const MastheadLogoArea: React.FC<MastheadProps> = ({ children, className }) => {
  return <div className={cn(styles.logoArea, className)}>{children}</div>;
};

export const MastheadPlaceholder: React.FC<MastheadPlaceholderProps> = ({
  className,
  twoColumn,
  tallHeight,
}) => {
  return (
    <div
      className={cn(styles.placeholder, className, {
        [styles.twoColumn]: twoColumn,
        [styles.tallHeight]: tallHeight,
      })}
    />
  );
};

export const MastheadMain: React.FC<MastheadProps> = ({ className, children }) => {
  return <div className={cn(styles.main, className)}>{children}</div>;
};

export const MastheadRightGroup: React.FC<MastheadProps> = ({
  children,
  className,
  staticPosition,
}) => {
  return (
    <ul className={cn(styles.rightGroup, className, { [styles.staticPosition]: staticPosition })}>
      {children}
    </ul>
  );
};

export const MastheadRightGroupMenu: React.FC<MastheadProps> = ({ children, className }) => {
  return <li className={cn(styles.menu, className)}>{children}</li>;
};

export interface MastheadWrapperProps {
  children: React.ReactNode;
  className?: string;
  twoColumn?: boolean;
  smallPadding?: boolean;
  tallHeight?: boolean;
}

export interface MastheadProps {
  children: React.ReactNode;
  className?: string;
  staticPosition?: boolean;
}

export interface MastheadPlaceholderProps {
  className?: string;
  twoColumn?: boolean;
  tallHeight?: boolean;
}
