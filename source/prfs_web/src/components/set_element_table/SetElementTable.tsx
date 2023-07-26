"use client";

import React from "react";
import Link from "next/link";

import styles from "./SetElementTable.module.scss";
import Table, { TableData, TableKeys } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";

const SetElementTable: React.FC<SetElementTableProps> = ({ setId }) => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback((keys: TableKeys<SetElementTableKeys>) => {
    return (
      <div className={styles.tableHeader}>
        <div key={keys[0]} className={styles.id}>
          {i18n.id}
        </div>
        <div key={keys[1]} className={styles.val}>
          {i18n.value}
        </div>
      </div>
    );
  }, []);

  const createBody = React.useCallback(
    (keys: TableKeys<SetElementTableKeys>, data: TableData<SetElementTableKeys>) => {
      // console.log(1, data);
      let { page, values } = data;

      let rows = [];
      if (values === undefined || values.length < 1) {
        return rows;
      }

      for (let val of values) {
        let row = (
          <div key={val.pos_w} className={styles.tableRow}>
            <div key={keys.pos_w} className={styles.id}>
              {val.pos_w}
            </div>
            <div key={keys.val} className={styles.val}>
              {val.val}
            </div>
          </div>
        );

        rows.push(row);
      }

      return (
        <div className={styles.tableBody} key={page}>
          {rows}
        </div>
      );
    },
    []
  );

  const handleChangePage = React.useCallback(
    async (page: number) => {
      return prfsBackend
        .getSetElements({
          page,
          limit: 20,
          set_id: setId,
        })
        .then(resp => {
          const { page, prfs_tree_nodes } = resp.payload;
          return {
            page,
            values: prfs_tree_nodes,
          };
        });
    },
    [setId]
  );

  return (
    <Table
      keys={SET_ELEMENT_TABLE_KEYS}
      createHeader={createHeader}
      createBody={createBody}
      onChangePage={handleChangePage}
    />
  );
};

export default SetElementTable;

const SET_ELEMENT_TABLE_KEYS = ["pos_h", "pos_w", "set_id", "val"] as const;

type SetElementTableKeys = (typeof SET_ELEMENT_TABLE_KEYS)[number];

export interface SetElementTableProps {
  setId: string;
}
