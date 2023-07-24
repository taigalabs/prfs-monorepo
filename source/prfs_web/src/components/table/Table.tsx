import React from "react";
import Link from "next/link";

import styles from "./Table.module.scss";
import { i18nContext } from "@/contexts/i18n";

function Table<T>({ columns, values, onChangePage }: TableProps<T>) {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    onChangePage(0);
  }, [onChangePage]);

  console.log(3, values);

  let columnElems = React.useMemo(() => {
    let elems = [];

    for (let id in columns) {
      let col = columns[id];

      console.log(5, col);

      elems.push(
        <div
          className={styles.cell}
          key={col.label}
          style={{
            width: col.width ? col.width : "auto",
            flexGrow: col.width ? 0 : 1,
          }}
        >
          {col.label}
        </div>
      );
    }

    return elems;
  }, [columns]);

  let rowElems = React.useMemo(() => {
    console.log(1, values, columns);

    let row = [];

    if (values === undefined || values.length < 1) {
      return row;
    }

    for (let value of values) {
      for (let id in columns) {
        let col = columns[id];
        let val = value[id];

        console.log(3, id, col, val);

        if (col && val) {
          row.push(
            <div
              className={styles.cell}
              key={col.label}
              style={{
                width: col.width ? col.width : "auto",
                flexGrow: col.width ? 0 : 1,
              }}
            >
              {val}
            </div>
          );
        }
      }
    }

    return <div className={styles.row}>{row}</div>;
  }, [values, columns]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableHeader}>{columnElems}</div>
      <div className={styles.tableBody}>{rowElems}</div>
    </div>
  );
}

export default Table;

export interface TableProps<T> {
  columns: TableColumns<T>;
  values?: TableValue<T>[];
  onChangePage: (page: number) => void;
}

export type TableColumns<T> = {
  [key in keyof T]: {
    label: string;
    width?: number;
  };
};

export type TableValue<T> = {
  [key in keyof T]: any;
};
