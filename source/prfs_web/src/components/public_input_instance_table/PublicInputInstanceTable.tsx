"use client";

import React from "react";
import Link from "next/link";
import { PublicInputInstanceEntry } from "@taigalabs/prfs-entities/bindings/PublicInputInstanceEntry";

import styles from "./PublicInputInstanceTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const PublicInputInstanceTable: React.FC<PublicInputInstanceTableProps> = ({
  publicInputInstance,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<PublicInputInstanceEntry>>({
    page: 0,
    values: [],
  });

  React.useEffect(() => {
    if (publicInputInstance) {
      setData({
        page: 0,
        values: Object.values(publicInputInstance),
      });
    }
  }, [publicInputInstance]);

  const rowsElem = React.useMemo(() => {
    let { values } = data;

    let rows: React.ReactNode[] = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      let row = (
        <TableRow key={val.label}>
          <td className={styles.type}>{val.type}</td>
          <td className={styles.label}>{val.label}</td>
          <td className={styles.ref}>{val.ref}</td>
          <td className={styles.value}>{val.value}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return rows;
  }, [data]);

  return (
    <Table minWidth={910}>
      <TableHeader>
        <TableRow>
          <th className={styles.type}>{i18n.type}</th>
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.ref}>{i18n.ref}</th>
          <th className={styles.value}>{i18n.value}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default PublicInputInstanceTable;

export interface PublicInputInstanceTableProps {
  publicInputInstance: Record<string, PublicInputInstanceEntry>;
}
