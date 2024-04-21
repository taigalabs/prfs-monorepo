import React from "react";
import cn from "classnames";

import styles from "./AppTableComponents.module.scss";

export const AppTableWrapper: React.FC<AppTableProps> = ({ children, innerRef, className }) => {
  return (
    <div className={cn(styles.wrapper, className)} ref={innerRef}>
      {children}
    </div>
  );
};

export const AppTableBody: React.FC<AppTableProps> = ({ children, innerRef, className }) => {
  return (
    <div className={cn(styles.tableBody, className)} ref={innerRef}>
      {children}
    </div>
  );
};

export const AppTableBody2: React.FC<AppTableProps> = ({ children, innerRef, className }) => {
  return (
    <div className={cn(styles.tableBody2, className)} ref={innerRef}>
      {children}
    </div>
  );
};

export const AppTableNoRecord: React.FC<AppTableProps> = ({ children, className }) => {
  return <div className={cn(styles.noRecord, className)}>{children}</div>;
};

export const AppTableBodyInner: React.FC<AppTableProps> = ({ children, style, className }) => {
  return (
    <div className={cn(styles.tableBodyInner, className)} style={style}>
      {children}
    </div>
  );
};

export const AppTableLoading: React.FC<AppTableProps> = ({ children, className }) => {
  return <div className={cn(styles.loading, className)}>{children}</div>;
};

export const AppTableHeader: React.FC<AppTableProps> = ({ children, className }) => {
  return <div className={cn(styles.tableHeader, className)}>{children}</div>;
};

export const AppTableHeaderCell: React.FC<AppTableCellProps> = ({
  children,
  className,
  alwaysRender,
  w320,
  w480,
  w720,
  w1024,
  w1280,
}) => {
  return (
    <div
      className={cn(styles.tableHeaderCell, className, {
        [styles.alwaysRender]: alwaysRender,
        [styles.w320]: w320,
        [styles.w480]: w480,
        [styles.w720]: w720,
        [styles.w1024]: w1024,
        [styles.w1280]: w1280,
      })}
    >
      {children}
    </div>
  );
};

export const AppTableCell: React.FC<AppTableCellProps> = ({
  children,
  className,
  alwaysRender,
  w320,
  w480,
  w720,
  w1024,
  w1280,
}) => {
  return (
    <div
      className={cn(styles.tableCell, className, {
        [styles.alwaysRender]: alwaysRender,
        [styles.w320]: w320,
        [styles.w480]: w480,
        [styles.w720]: w720,
        [styles.w1024]: w1024,
        [styles.w1280]: w1280,
      })}
    >
      {children}
    </div>
  );
};

export const AppTableRow: React.FC<AppTableRowProps> = ({
  children,
  className,
  style,
  handleClick,
}) => {
  return (
    <div className={cn(styles.tableRow, className)} style={style} onClick={handleClick}>
      {children}
    </div>
  );
};

export interface AppTableProps {
  children: React.ReactNode;
  className?: string;
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}

export interface AppTableCellProps {
  children: React.ReactNode;
  className?: string;
  alwaysRender?: boolean;
  w320?: boolean;
  w480?: boolean;
  w720?: boolean;
  w1024?: boolean;
  w1280?: boolean;
}

export interface AppTableRowProps {
  children: React.ReactNode;
  className?: string;
  handleClick?: () => void;
  style?: React.CSSProperties;
}
