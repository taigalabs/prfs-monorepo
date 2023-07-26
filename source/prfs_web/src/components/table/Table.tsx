import React from "react";

import styles from "./Table.module.scss";

export const TableCurrentPageLimitWarning: React.FC = () => {
  return <div className={styles.pageLimitWarning}>Currently showing up to 20 elements</div>;
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <div className={styles.tableHeaderWrapper}>{children}</div>;
};

export const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return <div className={styles.tableRowWrapper}>{children}</div>;
};

function Table<T extends string>({ keys, createHeader, createBody, onChangePage }: TableProps<T>) {
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
    return createBody(tableKeys, data);
  }, [data, tableKeys]);

  return (
    <div className={styles.wrapper}>
      {headerElems}
      <div>{bodyElems}</div>
    </div>
  );
}

export default Table;

export interface TableProps<T extends string> {
  keys: ReadonlyArray<T>;
  createHeader: (keys: TableKeys<T>) => React.ReactNode;
  createBody: (keys: TableKeys<T>, data: TableData<T>) => React.ReactNode;
  onChangePage: (page: number) => Promise<TableData<T>>;
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

export interface TableRowProps {
  children: React.ReactNode;
}
