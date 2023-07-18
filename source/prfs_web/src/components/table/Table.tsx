import React from "react";
import Link from "next/link";

import styles from "./Table.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";

const Table: React.FC<TableProps> = ({ columns, onChangePage }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {}, []);

  let columnElems = React.useMemo(() => {
    let elems = [];
    for (let col of columns) {
      elems.push(
        <div>
          <div>{col.key}</div>
          <div>{col.label}</div>
        </div>
      );
    }
    return elems;
  }, [columns]);

  return (
    <div className={styles.wrapper}>
      {columnElems}
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
