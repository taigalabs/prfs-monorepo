import React from "react";
import cn from "classnames";

import styles from "./LeftBar.module.scss";

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
}

export interface LeftBarItemButtonProps {
  children: React.ReactNode;
  className?: string;
  isHighlighted?: boolean;
  disabled?: boolean;
}
