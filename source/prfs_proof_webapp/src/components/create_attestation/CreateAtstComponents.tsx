import React from "react";
import cn from "classnames";

import styles from "./CreateAtstComponents.module.scss";

export const AttestationListItem: React.FC<AttestationListItemProps> = ({
  children,
  className,
  isDisabled,
}) => {
  return (
    <li
      className={cn(styles.listItem, className, {
        [styles.isDisabled]: isDisabled,
      })}
    >
      {children}
    </li>
  );
};

export const AttestationListRightCol: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.rightCol, className)}>{children}</div>;
};

export const AttestationListItemDesc: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.desc, className)}>{children}</div>;
};

export const AttestationListItemDescTitle: React.FC<ContentBoxProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.descTitle, className)}>{children}</div>;
};

export const AttestationListItemNo: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.no, className)}>{children}</div>;
};

export const AttestationListItemOverlay: React.FC<AttestationListItemOverlayProps> = ({
  className,
}) => {
  return <div className={cn(styles.overlay, className)} />;
};

export const AttestationContentBox: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.contentBox, className)}>{children}</div>;
};

export const AttestationFormBtnRow: React.FC<ContentBoxProps> = ({ children, className }) => {
  return <div className={cn(styles.formBtnRow, className)}>{children}</div>;
};

export const AttestationContentBoxBtnArea: React.FC<ContentBoxProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.contentBoxBtnArea, className)}>{children}</div>;
};

export const AttestationListItemBtn: React.FC<BtnProps> = ({
  children,
  className,
  handleClick,
}) => {
  return (
    <button className={cn(styles.btn, className)} onClick={handleClick}>
      {children}
    </button>
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

export interface AttestationListItemOverlayProps {
  className?: string;
}
