import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { CircuitDriver } from "@taigalabs/prfs-entities/bindings/CircuitDriver";
import { DriverInputMeta } from "@taigalabs/prfs-entities/bindings/DriverInputMeta";

import styles from "./DriverInputsMetaTable.module.scss";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableRecordData,
  TableData,
} from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const DriverInputsMetaTable: React.FC<DriverInputsMetaTableProps> = ({
  driver_inputs_meta,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<DriverInputMeta>>({
    page: 0,
    values: [],
  });

  // React.useEffect(() => {
  //   setData({ record: driver?.properties_meta });
  // }, [driver, setData]);

  // const rowsElem = React.useMemo(() => {
  //   let { record } = data;

  //   let rows: React.ReactNode[] = [];
  //   if (record === undefined || Object.keys(record).length < 1) {
  //     return rows;
  //   }

  //   for (const [key, val] of Object.entries(record)) {
  //     let row = (
  //       <TableRow key={key}>
  //         <td className={styles.label}>{key}</td>
  //         <td className={styles.value}>{val}</td>
  //       </TableRow>
  //     );

  //     rows.push(row);
  //   }

  //   return rows;
  // }, [data]);

  return (
    <Table minWidth={880}>
      <TableHeader>
        <TableRow>
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.value}>{i18n.value}</th>
        </TableRow>
      </TableHeader>
      {/* <TableBody>{rowsElem}</TableBody> */}
    </Table>
  );
};

export default DriverInputsMetaTable;

export interface DriverInputsMetaTableProps {
  driver_inputs_meta: DriverInputMeta[];
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
