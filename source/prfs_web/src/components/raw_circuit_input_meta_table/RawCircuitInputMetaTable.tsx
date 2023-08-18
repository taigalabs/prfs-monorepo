"use client";

import React from "react";
import Link from "next/link";
import { RawCircuitInputMeta } from "@taigalabs/prfs-entities/bindings/RawCircuitInputMeta";
import Table, {
  TableBody,
  TableHeader,
  TableRecordData,
  TableRow,
  TableData,
} from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./RawCircuitInputMetaTable.module.scss";
import { i18nContext } from "@/contexts/i18n";

const RawCircuitInputMetaTable: React.FC<RawCircuitInputMetaTableProps> = ({
  raw_circuit_inputs_meta,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, _] = React.useState<TableData<RawCircuitInputMeta>>({
    page: 0,
    values: raw_circuit_inputs_meta,
  });

  const rowsElem = React.useMemo(() => {
    let { values } = data;

    let rows: React.ReactNode[] = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      let row = (
        <TableRow key={val.label}>
          <td className={styles.label}>{val.label}</td>
          <td className={styles.type}>{val.type}</td>
          <td className={styles.public}>{val.public.toString()}</td>
          <td className={styles.desc}>{val.desc}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return rows;
  }, [data]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.type}>{i18n.type}</th>
          <th className={styles.public}>{i18n.public}</th>
          <th className={styles.desc}>{i18n.description}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default RawCircuitInputMetaTable;

export interface RawCircuitInputMetaTableProps {
  raw_circuit_inputs_meta: RawCircuitInputMeta[];
}
