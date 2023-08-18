import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { CircuitDriver } from "@taigalabs/prfs-entities/bindings/CircuitDriver";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableData,
} from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./CircuitInputsMetaTable.module.scss";
import { i18nContext } from "@/contexts/i18n";

const CircuitInputsMetaTable: React.FC<CircuitInputsMetaTableProps> = ({
  circuit_inputs_meta,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<CircuitInputMeta>>({
    page: 0,
    values: circuit_inputs_meta,
  });

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
          <td className={styles.desc}>{val.desc}</td>
          <td className={styles.type}>{val.type}</td>
          <td className={styles.ref}>{val.ref}</td>
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
          <th className={styles.desc}>{i18n.description}</th>
          <th className={styles.type}>{i18n.type}</th>
          <th className={styles.ref}>{i18n.reference}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default CircuitInputsMetaTable;

export interface CircuitInputsMetaTableProps {
  circuit_inputs_meta: CircuitInputMeta[];
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
