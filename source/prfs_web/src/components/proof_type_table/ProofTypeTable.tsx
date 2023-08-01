"use client";

import React from "react";
import Link from "next/link";

import styles from "./ProofTypeTable.module.scss";
import Table, { TableBody, TableRow, TableData, TableHeader } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import { KeysAsObject } from "@/models/types";

const ProofTypeTable: React.FC<ProofTypeTableProps> = () => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback(() => {
    return (
      <TableHeader>
        <TableRow>
          <th className={styles.id}>{i18n.id}</th>
          <th className={styles.val}>{i18n.value}</th>
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
        <TableRow key={val.pos_w}>
          <td className={styles.id}>{val.pos_w}</td>
          <td className={styles.val}>{val.val}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return <TableBody key={page}>{rows}</TableBody>;
  }, []);

  const handleChangePage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getSetElements({
        page,
        limit: 20,
        set_id: "0",
      })
      .then(resp => {
        const { page, prfs_tree_nodes } = resp.payload;
        return {
          page,
          values: prfs_tree_nodes,
        };
      });
  }, []);

  return (
    <Table
      createHeader={createHeader}
      createBody={createBody}
      onChangePage={handleChangePage}
      minWidth={800}
    />
  );
};

export default ProofTypeTable;

// const PROOF_TYPE_TABLE_KEYS = ["pos_h", "pos_w", "set_id", "val"] as const;

// type ProofTypeTableKeys = (typeof PROOF_TYPE_TABLE_KEYS)[number];

export interface ProofTypeTableProps {}
