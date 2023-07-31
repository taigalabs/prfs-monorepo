"use client";

import React from "react";
import Link from "next/link";

import styles from "./PublicInputTable.module.scss";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableData,
  TableSelectedValue,
} from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import { KeysAsObject, RecordOfKeys } from "@/models/types";
import {
  PRFS_SET_KEYS,
  PUBLIC_INPUT_KEYS,
  PrfsCircuit,
  PrfsSetKeys,
  PublicInputKeys,
} from "@/models";

const PublicInputTable: React.FC<PublicInputTableProps> = ({ circuit }) => {
  console.log(11, circuit);

  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback((keys: KeysAsObject<PublicInputKeys>) => {
    return (
      <TableHeader>
        <TableRow>
          <th key={keys[0]} className={styles.type}>
            {i18n.type}
          </th>
          <th key={keys[1]} className={styles.label}>
            {i18n.label}
          </th>
          <th key={keys[2]} className={styles.desc}>
            {i18n.description}
          </th>
        </TableRow>
      </TableHeader>
    );
  }, []);

  const createBody = React.useCallback(({ keys, data }) => {
    // console.log(1, data);
    let { page, values } = data;

    let rows = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      // const onClickRow = handleSelectVal
      //   ? () => {
      //       handleSelectVal(val);
      //     }
      // : undefined;

      let row = (
        <TableRow key={val.label}>
          <td key={keys.type} className={styles.type}>
            {val.type}
          </td>
          <td key={keys.author} className={styles.label}>
            {val.label}
          </td>
          <td key={keys.desc} className={styles.desc}>
            {val.desc}
          </td>
        </TableRow>
      );

      rows.push(row);
    }

    return <TableBody key={page}>{rows}</TableBody>;
  }, []);

  const onChangePage = React.useCallback(() => {
    return Promise.resolve({
      page: 0,
      values: circuit ? circuit.public_inputs : [],
    });
  }, [circuit]);

  return (
    <Table
      keys={PUBLIC_INPUT_KEYS}
      createHeader={createHeader}
      createBody={createBody}
      minWidth={910}
      onChangePage={onChangePage}
    />
  );
};

export default PublicInputTable;

export interface PublicInputTableProps {
  circuit: PrfsCircuit;
}
