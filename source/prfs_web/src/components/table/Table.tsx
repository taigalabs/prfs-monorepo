import React, { MouseEventHandler } from "react";

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

export function TableRow<T extends string>({ children, handleSelectVal }: TableRowProps<T>) {
  return (
    <tr className={styles.tableRowWrapper} {...(onClickRow && { onClick: onClickRow })}>
      {children}
    </tr>
  );
}

function Table<T extends string>({
  keys,
  createHeader,
  createBody,
  onChangePage,
  // onClickRow,
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
    const tableKeys: TableKeys<T> = keys.reduce((r, key) => {
      return {
        ...r,
        [key]: key,
      };
    }, {} as TableKeys<T>);
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
  createHeader: (keys: TableKeys<T>) => React.ReactNode;
  createBody: (args: CreateBodyArgs<T>) => React.ReactNode;
  onChangePage: (page: number) => Promise<TableData<T>>;
  // onClickRow?: ClickRowFunction<T>;
  handleSelectVal?: (row: TableRowValue<T>) => void;
  minWidth: number;
  selectedVal?: TableSelectedValue<T>;
}

export type CreateBodyArgs<T extends string> = {
  keys: TableKeys<T>;
  data: TableData<T>;
  // onClickRow: ClickRowFunction<T>;
  selectedVal: TableSelectedValue<T>;
  handleSelectVal?: (row: TableRowValue<T>) => void;
};

export type TableKeys<T extends string> = ObjectFromList<ReadonlyArray<T>, string>;

export type TableData<T extends string> = {
  page: number;
  values: TableRowValue<T>[];
};

export type TableRowValue<T extends string> = {
  [key in T]: any;
};

export interface TableSelectedValue<T extends string> {
  [key: string]: TableRowValue<T>;
}

type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

export interface TableHeaderProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

export interface TableRowProps<T extends string> {
  children: React.ReactNode;
  handleSelectVal?: (row: TableRowValue<T>) => ClickRowFunction<T>;
}

// export type ClickRowFunction<T extends string> = (val: TableRowValue<T>) => void;
