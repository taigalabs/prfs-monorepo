"use client";

import React from "react";
import Link from "next/link";
import { PublicInput } from "@taigalabs/prfs-entities/bindings/PublicInput";

import styles from "./PublicInputTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const PublicInputTable: React.FC<PublicInputTableProps> = ({ public_inputs }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<PublicInput>>({ page: 0, values: [] });

  React.useEffect(() => {
    if (public_inputs) {
      setData({
        page: 0,
        values: public_inputs,
      });
    }
  }, [public_inputs]);

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
          <td className={styles.desc}>{val.desc}</td>
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
          <th className={styles.desc}>{i18n.description}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default PublicInputTable;

export interface PublicInputTableProps {
  public_inputs: PublicInput[];
}
