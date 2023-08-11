import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";

import styles from "./CircuitTypeTable.module.scss";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableData,
  TableRecordData,
} from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const CircuitTypeTable: React.FC<CircuitTypeTableProps> = ({ circuit_types }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableRecordData<Record<number, string>>>({ record: {} });

  React.useEffect(() => {
    const circuitTypes: Record<number, string> = {};

    if (!circuit_types) {
      return;
    }

    circuit_types.forEach((circuit_type, idx) => {
      circuitTypes[idx] = circuit_type;
    });

    setData({
      record: circuitTypes,
    });
  }, [circuit_types, setData]);

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

export default CircuitTypeTable;

export interface CircuitTypeTableProps {
  circuit_types: string[] | undefined;
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
