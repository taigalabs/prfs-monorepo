import React, { MouseEventHandler } from "react";
import classNames from "classnames";
import { MdFilterList } from "@react-icons/all-files/md/MdFilterList";

import styles from "./Table.module.scss";

export const PaddedTableWrapper: React.FC<PaddedTableWrapperProps> = ({ children }) => {
  return <div className={styles.paddedTableWrapper}>{children}</div>;
};

export const TableCurrentPageLimitWarning: React.FC = () => {
  return <div className={styles.pageLimitWarning}>Currently showing up to 20 elements</div>;
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <thead className={styles.tableHeaderWrapper}>{children}</thead>;
};

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const TableSearch: React.FC<TableSearchProps> = ({ children }) => {
  return (
    <div className={styles.tableSearch}>
      <div className={styles.guide}>
        <MdFilterList />
        <span>Filter</span>
      </div>
      {children}
    </div>
  );
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

function Table({ children }: TableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}

export default Table;

export interface TableProps {
  children: React.ReactNode;
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

export interface PaddedTableWrapperProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

export interface TableSearchProps {
  children: React.ReactNode;
}

export interface TableRowProps {
  isSelected?: boolean;
  children: React.ReactNode;
  onClickRow?: MouseEventHandler;
}
