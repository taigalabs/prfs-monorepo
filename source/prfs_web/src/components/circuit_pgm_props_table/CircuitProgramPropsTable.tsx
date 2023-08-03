"use client";

import React from "react";
import Link from "next/link";

import styles from "./CircuitProgramPropsTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import { PrfsCircuit, PrfsCircuitProgram } from "@/models";

const CircuitProgramPropsTable: React.FC<CircuitProgramPropsTableProps> = ({
  program,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<Record<string, any>>>({ page: 0, values: [] });

  React.useEffect(() => {
    if (program) {
      setData({
        page: 0,
        values: Object.entries(program.properties),
      });
    }
  }, [program]);

  const headerElem = React.useMemo(() => {
    let { values } = data;
    if (values === undefined || values.length < 1) {
      return null;
    }

    console.log(11, values);

    return (
      <TableHeader>
        <TableRow>
          {handleSelectVal && <th className={styles.radio}></th>}
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.desc}>{i18n.description}</th>
        </TableRow>
      </TableHeader>
    );
  }, [data, handleSelectVal]);

  const rowsElem = React.useMemo(() => {
    let { page, values } = data;

    let rows = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      let row = (
        <TableRow key={val.circuit_id}>
          <td key={val[0]}>{val[0]}</td>
          <td key={val[1]}>{val[1]}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return rows;
  }, [program]);

  return (
    <Table minWidth={880}>
      {headerElem}
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default CircuitProgramPropsTable;

export interface CircuitProgramPropsTableProps {
  program: PrfsCircuitProgram;
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
