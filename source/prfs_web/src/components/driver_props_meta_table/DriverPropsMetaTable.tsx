"use client";

import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { CircuitDriver } from "@taigalabs/prfs-entities/bindings/CircuitDriver";

import styles from "./DriverPropsMetaTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, TableRecordData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const DriverPropsMetaTable: React.FC<DriverPropsMetaTableProps> = ({ driverPropsMeta }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableRecordData<Record<string, any> | undefined>>({
    record: driverPropsMeta,
  });

  React.useEffect(() => {
    setData({ record: driverPropsMeta });
  }, [driverPropsMeta, setData]);

  const rowsElem = React.useMemo(() => {
    let { record } = data;

    console.log(11, record);

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
  driverPropsMeta: Record<string, any> | undefined;
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
