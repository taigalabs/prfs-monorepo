import React, { ReactNode } from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Table, {
  TableBody,
  TableHeader,
  TableData,
  TableRecordData,
  TableRow,
} from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./DriverPropInstanceTable.module.scss";
import { i18nContext } from "@/contexts/i18n";

const DriverPropInstanceTable: React.FC<DriverPropInstanceTableProps> = ({
  driver_properties,
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, _] = React.useState<TableRecordData<Record<string, any>>>({
    record: driver_properties,
  });

  const rowsElem = React.useMemo(() => {
    let { record } = data;

    let rows: React.ReactNode[] = [];
    if (record === undefined || Object.keys(record).length < 1) {
      return rows;
    }

    for (const [key, val] of Object.entries(record)) {
      let row = (
        <TableRow key={key}>
          <td className={styles.key}>{key}</td>
          <td className={styles.val}>{val}</td>
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
          {handleSelectVal && <th className={styles.radio}></th>}
          <th className={styles.key}>{i18n.label}</th>
          <th className={styles.value}>{i18n.value}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default DriverPropInstanceTable;

interface DriverPropInstanceTableProps {
  driver_properties: Record<string, any>;
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
