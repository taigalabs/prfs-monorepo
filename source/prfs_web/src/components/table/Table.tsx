import React from "react";
import Link from "next/link";
import classNames from "classnames";

import styles from "./Table.module.scss";
import { i18nContext } from "@/contexts/i18n";

function Table<T extends string>({
  columns,
  createRows,
  onChangePage,
  headerClassName,
}: TableProps<T>) {
  const i18n = React.useContext(i18nContext);

  const [data, setValues] = React.useState({ page: 0, values: [] });

  React.useEffect(() => {
    onChangePage(0).then(res => {
      setValues(res);
    });
  }, [onChangePage, setValues]);

  let columnElems = React.useMemo(() => {
    let elems = [];

    for (let col of columns) {
      elems.push(col.elem);
    }

    return elems;
  }, [columns]);

  let rowElems = React.useMemo(() => {
    return createRows(data);
  }, [data]);

  return (
    <div className={styles.wrapper}>
      <div className={classNames(styles.tableHeader, headerClassName)}>{columnElems}</div>
      <div className={styles.tableBody}>{rowElems}</div>
    </div>
  );
}

export default Table;

export interface TableProps<T extends string> {
  headerClassName?: string;
  columns: TableColumns<T>;
  createRows: (data: TableData<T>) => React.ReactNode;
  onChangePage: (page: number) => Promise<TableData<T>>;
}

export type TableColumns<T> = {
  key: T;
  elem: React.JSX.Element;
}[];

export type TableData<T extends string> = {
  page: number;
  values: {
    [key in T]: any;
  }[];
};
