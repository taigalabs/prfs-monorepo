"use client";

import React from "react";
import Link from "next/link";

import styles from "./PublicInputTable.module.scss";
import Table, { TableBody, TableRow, TableHeader } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import { PrfsCircuit } from "@/models";

const PublicInputTable: React.FC<PublicInputTableProps> = ({ circuit }) => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback(() => {
    return (
      <TableHeader>
        <TableRow>
          <th className={styles.type}>{i18n.type}</th>
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.desc}>{i18n.description}</th>
        </TableRow>
      </TableHeader>
    );
  }, []);

  const createBody = React.useCallback(({ data }) => {
    // console.log(1, data);
    let { page, values } = data;

    let rows = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      let row = (
        <TableRow key={val.label}>
          <td className={styles.type}>{val.type}</td>
          <td className={styles.label}>{val.label}</td>
          <td className={styles.desc}>{val.desc}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return <TableBody key={page}>{rows}</TableBody>;
  }, []);

  const initialValues = React.useMemo(() => {
    return circuit ? circuit.public_inputs : [];
  }, [circuit]);

  return (
    circuit && (
      <Table
        createHeader={createHeader}
        createBody={createBody}
        minWidth={910}
        initialValues={initialValues}
        tableLayout="fixed"
      />
    )
  );
};

export default PublicInputTable;

export interface PublicInputTableProps {
  circuit: PrfsCircuit;
}
