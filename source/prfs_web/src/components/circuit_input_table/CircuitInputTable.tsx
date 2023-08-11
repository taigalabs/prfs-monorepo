"use client";

import React from "react";
import Link from "next/link";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";

import styles from "./CircuitInputTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const CircuitInputTable: React.FC<CircuitInputTableProps> = ({ circuit_public_inputs_meta }) => {
  const i18n = React.useContext(i18nContext);
  const [data, _] = React.useState<TableData<CircuitInputMeta>>({
    page: 0,
    values: circuit_public_inputs_meta,
  });

  const rowsElem = React.useMemo(() => {
    let { values } = data;

    let rows: React.ReactNode[] = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      console.log(11, val);
      let row = (
        <TableRow key={val.label}>
          <td className={styles.label}>{val.label}</td>
          <td className={styles.type}>{val.type}</td>
          <td className={styles.public}>{val.public.toString()}</td>
          <td className={styles.desc}>{val.desc}</td>
          <td className={styles.desc}>{val.ref}</td>
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
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.type}>{i18n.type}</th>
          <th className={styles.public}>{i18n.public}</th>
          <th className={styles.desc}>{i18n.description}</th>
          <th className={styles.ref}>{i18n.references}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default CircuitInputTable;

export interface CircuitInputTableProps {
  circuit_public_inputs_meta: CircuitInputMeta[];
}
