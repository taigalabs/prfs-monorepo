import React from "react";
import cn from "classnames";

import styles from "./CreateAtstComponents.module.scss";

export const AttestationListItem: React.FC<AttestationListItemProps> = ({
  children,
  className,
  isDisabled,
}) => {
  return (
    <div
      className={cn(styles.listItem, className, {
        [styles.isDisabled]: isDisabled,
      })}
    >
      {children}
    </div>
  );
};

export const AttestationListRightCol: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.rightCol, className)}>{children}</div>;
};

export const AttestationListItemNo: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.no, className)}>{children}</div>;
};

export const AttestationOverlay: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.overlay, className)}>{children}</div>;
};

export const ContentBox: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.contentBox, className)}>{children}</div>;
};

export const ContentBoxBtnArea: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.contentBoxBtnArea, className)}>{children}</div>;
};

export const Btn: React.FC<BtnProps> = ({ children, className, handleClick }) => {
  return (
    <div className={cn(styles.btn, className)} onClick={handleClick}>
      {children}
    </div>
  );
};

export interface AttestationListItemProps {
  children: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
}

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
