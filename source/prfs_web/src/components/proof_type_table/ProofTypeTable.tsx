"use client";

import React from "react";
import Link from "next/link";

import styles from "./ProofTypeTable.module.scss";
import Table, { TableRow, TableData, TableHeader, TableKeys } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";

const ProofTypeTable: React.FC<ProofTypeTableProps> = () => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback((keys: TableKeys<ProofTypeTableKeys>) => {
    return (
      <TableHeader>
        <div key={keys[0]} className={styles.id}>
          {i18n.id}
        </div>
        <div key={keys[1]} className={styles.val}>
          {i18n.value}
        </div>
      </TableHeader>
    );
  }, []);

  const createBody = React.useCallback(
    (keys: TableKeys<ProofTypeTableKeys>, data: TableData<ProofTypeTableKeys>) => {
      // console.log(1, data);
      let { page, values } = data;

      let rows = [];
      if (values === undefined || values.length < 1) {
        return rows;
      }

      for (let val of values) {
        let row = (
          <TableRow key={val.pos_w}>
            <div key={keys.pos_w} className={styles.id}>
              {val.pos_w}
            </div>
            <div key={keys.val} className={styles.val}>
              {val.val}
            </div>
          </TableRow>
        );

        rows.push(row);
      }

      return <div key={page}>{rows}</div>;
    },
    []
  );

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
      keys={PROOF_TYPE_TABLE_KEYS}
      createHeader={createHeader}
      createBody={createBody}
      onChangePage={handleChangePage}
    />
  );
};

export default ProofTypeTable;

const PROOF_TYPE_TABLE_KEYS = ["pos_h", "pos_w", "set_id", "val"] as const;

type ProofTypeTableKeys = (typeof PROOF_TYPE_TABLE_KEYS)[number];

export interface ProofTypeTableProps {}
