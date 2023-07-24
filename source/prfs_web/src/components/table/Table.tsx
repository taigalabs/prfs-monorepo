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

    // for (let col of columns) {
    //   elems.push(
    //     <div key={col.key}>
    //       <div>{col.key}</div>
    //       <div>{col.label}</div>
    //     </div>
    //   );
    // }
    // return elems;
    //
    for (let id of Object.keys(columns)) {
      console.log(11, id);
    }

    return elems;
  }, [columns]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableHeader}>{columnElems}</div>
      power
    </div>
  );
}

export default Table;

export interface TableProps<T> {
  columns: T;
  values?: TableValues<T>;
  onChangePage: (page: number) => void;
}

export interface TableColumns {
  [key: string]: any;
}

export type TableValues<T> = {
  [key in keyof T]: any;
};
