"use client";

import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { DriverPropertyMeta } from "@taigalabs/prfs-entities/bindings/DriverPropertyMeta";
import Table, {
  TableBody,
  TableHeader,
  TableData,
  TableRecordData,
  TableRow,
} from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./DriverPropsMetaTable.module.scss";
import { i18nContext } from "@/contexts/i18n";

const DriverPropsMetaTable: React.FC<DriverPropsMetaTableProps> = ({ driverPropsMeta }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<DriverPropertyMeta>>({
    page: 0,
    values: [],
  });

  React.useEffect(() => {
    if (driverPropsMeta) {
      setData({ page: 0, values: driverPropsMeta });
    }
  }, [driverPropsMeta, setData]);

  const rowsElem = React.useMemo(() => {
    let { values } = data;

    let rows: React.ReactNode[] = [];
    if (values.length < 1) {
      return rows;
    }

    for (const val of values) {
      let row = (
        <TableRow key={val.label}>
          <td className={styles.label}>{val.label}</td>
          <td className={styles.value}>{val.desc}</td>
          <td className={styles.value}>{val.type}</td>
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
          <th className={styles.value}>{i18n.description}</th>
          <th className={styles.value}>{i18n.type}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default DriverPropsMetaTable;

export interface DriverPropsMetaTableProps {
  driverPropsMeta: DriverPropertyMeta[] | undefined;
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
