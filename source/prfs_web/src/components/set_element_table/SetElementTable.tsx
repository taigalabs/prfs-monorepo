"use client";

import React from "react";
import Link from "next/link";

import styles from "./SetElementTable.module.scss";
import Table, { TableBody, TableRow, TableData, TableHeader } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";

const SetElementTable: React.FC<SetElementTableProps> = ({ setId }) => {
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
      createHeader={createHeader}
      createBody={createBody}
      onChangePage={handleChangePage}
      minWidth={800}
    />
  );
};

export default SetElementTable;

export interface SetElementTableProps {
  setId: string;
}
