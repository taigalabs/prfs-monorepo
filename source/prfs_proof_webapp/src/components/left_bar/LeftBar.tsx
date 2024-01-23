import React from "react";
import cn from "classnames";

import styles from "./LeftBar.module.scss";

export const LeftBarDrawerContainer: React.FC<LeftBarItemProps> = ({ children, className }) => {
  return <div className={cn(styles.leftBarDrawerContainer, className)}>{children}</div>;
};

export const LeftBarContainer: React.FC<LeftBarItemProps> = ({
  children,
  className,
  isVisible,
}) => {
  return (
    <div
      className={cn(styles.leftBarContainer, className, {
        [styles.isVisible]: isVisible,
      })}
    >
      {children}
    </div>
  );
};

export const LeftBarWrapper: React.FC<LeftBarItemProps> = ({ children, className }) => {
  return <div className={cn(styles.wrapper, className)}>{children}</div>;
};

export const LeftBarTopMenu: React.FC<LeftBarItemProps> = ({ children, className }) => {
  return <div className={cn(styles.topMenu, className)}>{children}</div>;
};

export const LeftBarItem: React.FC<LeftBarItemProps> = ({ children, className }) => {
  return <div className={cn(styles.item, className)}>{children}</div>;
};

export const LeftBarItemButton: React.FC<LeftBarItemButtonProps> = ({
  children,
  className,
  isHighlighted,
  disabled,
}) => {
  return (
    <button
      className={cn(styles.itemButton, className, {
        [styles.isHighlighted]: isHighlighted,
      })}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const LeftBarMenu: React.FC<LeftBarItemProps> = ({ children, className }) => {
  return <div className={cn(styles.menu, className)}>{children}</div>;
};

export interface LeftBarItemProps {
  children: React.ReactNode;
  className?: string;
  isVisible?: boolean;
}

export interface LeftBarItemButtonProps {
  children: React.ReactNode;
  className?: string;
  isHighlighted?: boolean;
  disabled?: boolean;
}
