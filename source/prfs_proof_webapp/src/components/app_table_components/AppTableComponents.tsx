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
  children?: React.ReactNode;
  className?: string;
  alwaysRender?: boolean;
  w320?: boolean;
  w480?: boolean;
  w720?: boolean;
  w1024?: boolean;
  w1280?: boolean;
  flexGrow?: boolean;
}

export interface AppTableRowProps {
  children: React.ReactNode;
  className?: string;
  handleClick?: () => void;
  style?: React.CSSProperties;
}
