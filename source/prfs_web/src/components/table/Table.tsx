import React, { MouseEventHandler } from "react";

import styles from "./Table.module.scss";
import classNames from "classnames";
import { KeysAsObject, RecordOfKeys } from "@/models/types";

export const TableCurrentPageLimitWarning: React.FC = () => {
  return <div className={styles.pageLimitWarning}>Currently showing up to 20 elements</div>;
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <thead className={styles.tableHeaderWrapper}>{children}</thead>;
};

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody className={styles.tableBodyWrapper}>{children}</tbody>;
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

function Table<T extends string>({
  keys,
  createHeader,
  createBody,
  onChangePage,
  handleSelectVal,
  minWidth,
  selectedVal,
}: TableProps<T>) {
  const [data, setValues] = React.useState({ page: 0, values: [] });

  React.useEffect(() => {
    onChangePage(0).then(res => {
      setValues(res);
    });
  }, [onChangePage, setValues]);

  const tableKeys = React.useMemo(() => {
    const tableKeys: KeysAsObject<T> = keys.reduce((r, key) => {
      return {
        ...r,
        [key]: key,
      };
    }, {} as RecordOfKeys<T>);
    return tableKeys;
  }, [keys]);

  let headerElems = React.useMemo(() => {
    return createHeader(tableKeys);
  }, [tableKeys]);

  let bodyElems = React.useMemo(() => {
    return createBody({
      keys: tableKeys,
      data,
      handleSelectVal,
      selectedVal,
    });
  }, [data, tableKeys, selectedVal, handleSelectVal]);

  return (
    <div className={styles.tableWrapper}>
      <table
        className={styles.table}
        style={{
          minWidth,
        }}
      >
        {headerElems}
        {bodyElems}
      </table>
    </div>
  );
}

export default Table;

export interface TableProps<T extends string> {
  keys: ReadonlyArray<T>;
  createHeader: (keys: RecordOfKeys<T>) => React.ReactNode;
  createBody: (args: CreateBodyArgs<T>) => React.ReactNode;
  onChangePage: (page: number) => Promise<TableData<T>>;
  minWidth: number;
  selectedVal?: TableSelectedValue<T>;
  handleSelectVal?: (row: RecordOfKeys<T>) => void;
}

export type CreateBodyArgs<T extends string> = {
  keys: KeysAsObject<T>;
  data: TableData<T>;
  selectedVal: TableSelectedValue<T>;
  handleSelectVal?: (row: RecordOfKeys<T>) => void;
};

export type TableData<T extends string> = {
  page: number;
  values: RecordOfKeys<T>[];
};

export interface TableSelectedValue<T extends string> {
  [id: string]: RecordOfKeys<T>;
}

export interface TableHeaderProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

export interface TableRowProps {
  isSelected?: boolean;
  children: React.ReactNode;
  onClickRow?: MouseEventHandler;
}
