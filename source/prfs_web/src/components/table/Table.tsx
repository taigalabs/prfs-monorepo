import React from "react";

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

export function TableRow<T>({ children, onClickRow }: TableRowProps<T>) {
  return (
    <tr className={styles.tableRowWrapper} {...(onClickRow && { onClickRow })}>
      {children}
    </tr>
  );
}

function Table<T extends string>({
  keys,
  createHeader,
  createBody,
  onChangePage,
  onClickRow,
  minWidth,
  selectable,
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
    return createHeader(tableKeys, !!selectable);
  }, [tableKeys]);

  let bodyElems = React.useMemo(() => {
    return createBody({
      keys: tableKeys,
      data,
      selectable: !!selectable,
      onClickRow,
    });
  }, [data, tableKeys, selectable]);

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
  createHeader: (keys: TableKeys<T>, selectable: boolean) => React.ReactNode;
  createBody: (args: {
    keys: TableKeys<T>;
    data: TableData<T>;
    selectable: boolean;
    onClickRow: ClickRowFunction<T>;
  }) => React.ReactNode;
  onChangePage: (page: number) => Promise<TableData<T>>;
  onClickRow?: ClickRowFunction<T>;
  minWidth: number;
  selectable?: boolean;
}

export type TableKeys<T extends string> = ObjectFromList<ReadonlyArray<T>, string>;

export type TableData<T extends string> = {
  page: number;
  values: {
    [key in T]: any;
  }[];
};

type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

export interface TableHeaderProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

export interface TableRowProps<T> {
  children: React.ReactNode;
  onClickRow?: ClickRowFunction<T>;
}

export type ClickRowFunction<T> = (row: T) => void;
