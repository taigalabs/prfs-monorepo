import React from "react";
import cn from "classnames";

import styles from "./AttestationsTable.module.scss";

export const AttestationTableBody: React.FC<AttestationsProps> = ({
  children,
  innerRef,
  className,
}) => {
  return (
    <div className={cn(styles.tableBody, className)} ref={innerRef}>
      {children}
    </div>
  );
};

export const AttestationTableNoRecord: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.noRecord, className)}>{children}</div>;
};

export const AttestationTableBodyInner: React.FC<AttestationsProps> = ({
  children,
  style,
  className,
}) => {
  return (
    <div className={cn(styles.tableBodyInner, className)} style={style}>
      {children}
    </div>
  );
};

export const AttestationTableHeader: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.tableHeader, className)}>{children}</div>;
};

export const AttestationTableHeaderCell: React.FC<AttestationsProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.tableHeaderCell, className)}>{children}</div>;
};

export const AttestationTableCell: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.tableCell, className)}>{children}</div>;
};

export const AttestationTableRow: React.FC<AttestationsTableRowProps> = ({
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

export interface AttestationsProps {
  children: React.ReactNode;
  className?: string;
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}

export interface AttestationsTableRowProps {
  children: React.ReactNode;
  className?: string;
  handleClick?: () => void;
  style?: React.CSSProperties;
}
