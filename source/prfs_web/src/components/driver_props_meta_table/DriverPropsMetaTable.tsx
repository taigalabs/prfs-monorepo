"use client";

import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { CircuitDriver } from "@taigalabs/prfs-entities/bindings/CircuitDriver";

import styles from "./DriverPropsMetaTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, TableRecordData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const DriverPropsMetaTable: React.FC<DriverPropsMetaTableProps> = ({ driver, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableRecordData<Record<string, any> | undefined>>({
    record: driver,
  });

  React.useEffect(() => {
    setData({ record: driver?.properties_meta });
  }, [driver, setData]);

  const rowsElem = React.useMemo(() => {
    let { record } = data;

    let rows: React.ReactNode[] = [];
    if (record === undefined || Object.keys(record).length < 1) {
      return rows;
    }

    for (const [key, val] of Object.entries(record)) {
      let row = (
        <TableRow key={key}>
          <td className={styles.label}>{key}</td>
          <td className={styles.value}>{val}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return rows;
  }, [data]);

  return (
    <Table minWidth={880}>
      <TableHeader>
        <TableRow>
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.value}>{i18n.value}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default DriverPropsMetaTable;

export interface DriverPropsMetaTableProps {
  driver: CircuitDriver | undefined;
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
