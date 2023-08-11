import React, { MouseEventHandler } from "react";
import classNames from "classnames";

import styles from "./Table.module.scss";

export const TableCurrentPageLimitWarning: React.FC = () => {
  return <div className={styles.pageLimitWarning}>Currently showing up to 20 elements</div>;
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <thead className={styles.tableHeaderWrapper}>{children}</thead>;
};

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody className={styles.tableBodyWrapper}>{children}</tbody>;
};

export const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return <td className={styles.tableCell}>{children}</td>;
};

export function TableRow({ isSelected, children, onClickRow }: TableRowProps) {
  return (
    <tr
      className={classNames({
        [styles.tableRowWrapper]: true,
        [styles.selectedRow]: !!isSelected,
      })}
      {...(onClickRow && { onClick: onClickRow })}
    >
      {children}
    </tr>
  );
}

function Table({ minWidth, children }: TableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table
        className={styles.table}
        style={{
          minWidth,
        }}
      >
        {children}
      </table>
    </div>
  );
}

export default Table;

export interface TableProps {
  children: React.ReactNode;
  minWidth: number;
}

export type TableData<T> = {
  page: number;
  values: T[];
};

export type TableRecordData<R> = {
  record: R;
};

export interface TableHeaderProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

export interface TableCellProps {
  children: React.ReactNode;
}

export interface TableRowProps {
  isSelected?: boolean;
  children: React.ReactNode;
  onClickRow?: MouseEventHandler;
}
