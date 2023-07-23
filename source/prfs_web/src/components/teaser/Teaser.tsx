import React from "react";
import Link from "next/link";

import styles from "./Table.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Teaser: React.FC<TableProps> = () => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {}, []);

  // let columnElems = React.useMemo(() => {
  //   let elems = [];
  //   for (let col of columns) {
  //     elems.push(
  //       <div key={col.key}>
  //         <div>{col.key}</div>
  //         <div>{col.label}</div>
  //       </div>
  //     );
  //   }
  //   return elems;
  // }, [columns]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableHeader}>{columnElems}</div>
      power
    </div>
  );
};

export default Table;

export interface TableProps {
  columns: TableColumn[];
  onChangePage: (page: number) => void;
}

export interface TableColumn {
  key: string;
  label: string;
}
