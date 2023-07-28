"use client";

import React from "react";
import Link from "next/link";

import styles from "./CircuitTable.module.scss";
import Table, {
  TableBody,
  TableRow,
  TableData,
  TableHeader,
  TableKeys,
} from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";

const CircuitTable: React.FC<CircuitTableProps> = ({ selectable }) => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback(
    (keys: TableKeys<CircuitTableKeys>, selectable: boolean) => {
      return (
        <TableHeader>
          <TableRow>
            {selectable && (
              <th key="select" className={styles.circuit_id}>
                se
              </th>
            )}
            <th key={keys.circuit_id} className={styles.circuit_id}>
              {i18n.circuit_id}
            </th>
            <th key={keys.label} className={styles.label}>
              {i18n.label}
            </th>
            <th key={keys.desc} className={styles.desc}>
              {i18n.description}
            </th>
            <th key={keys.author} className={styles.author}>
              {i18n.author}
            </th>
            <th key={keys.created_at} className={styles.createdAt}>
              {i18n.created_at}
            </th>
          </TableRow>
        </TableHeader>
      );
    },
    []
  );

  const createBody = React.useCallback(
    (keys: TableKeys<CircuitTableKeys>, data: TableData<CircuitTableKeys>, selectable: boolean) => {
      // console.log(1, data);
      let { page, values } = data;

      let rows = [];
      if (values === undefined || values.length < 1) {
        return rows;
      }

      console.log(11, selectable);

      for (let val of values) {
        let row = (
          <TableRow key={val.circuit_id}>
            {selectable && (
              <td key="select" className={styles.circuit_id}>
                radio
              </td>
            )}
            <td key={keys.circuit_id} className={styles.circuit_id}>
              <Link href={`/circuits/${val.circuit_id}`}>{val.circuit_id}</Link>
            </td>
            <td key={keys.label} className={styles.label}>
              {val.label}
            </td>
            <td key={keys.desc} className={styles.desc}>
              {val.desc}
            </td>
            <td key={keys.author} className={styles.author}>
              {val.author}
            </td>
            <td key={keys.created_at} className={styles.createdAt}>
              {val.created_at}
            </td>
          </TableRow>
        );

        rows.push(row);
      }

      return <TableBody key={page}>{rows}</TableBody>;
    },
    []
  );

  const handleChangeProofPage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getPrfsNativeCircuits({
        page,
      })
      .then(resp => {
        const { page, prfs_circuits } = resp.payload;
        return {
          page,
          values: prfs_circuits,
        };
      });
  }, []);

  return (
    <Table
      keys={CIRCUIT_TABLE_KEYS}
      createHeader={createHeader}
      createBody={createBody}
      onChangePage={handleChangeProofPage}
      minWidth={880}
      selectable={selectable}
    />
  );
};

export default CircuitTable;

export interface CircuitTableProps {
  selectable?: boolean;
}

const CIRCUIT_TABLE_KEYS = [
  "circuit_id",
  "label",
  "author",
  "num_public_inputs",
  "desc",
  "created_at",
] as const;

type CircuitTableKeys = (typeof CIRCUIT_TABLE_KEYS)[number];
