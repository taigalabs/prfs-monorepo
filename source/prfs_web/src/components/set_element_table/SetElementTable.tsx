"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";

import styles from "./SetElementTable.module.scss";
import Table, { TableBody, TableRow, TableData, TableHeader } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const SetElementTable: React.FC<SetElementTableProps> = ({ setId }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<PrfsTreeNode>>({ page: 0, values: [] });

  const handleChangePage = React.useCallback(
    async (page: number) => {
      return prfsApi
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

  React.useEffect(() => {
    Promise.resolve(handleChangePage(0)).then(res => {
      setData(res);
    });
  }, [setData, handleChangePage]);

  const rowsElem = React.useMemo(() => {
    // console.log(1, data);
    let { page, values } = data;

    let rows: React.ReactNode[] = [];
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

    return rows;
  }, [data]);

  return (
    <Table minWidth={800}>
      <TableHeader>
        <TableRow>
          <th className={styles.id}>{i18n.id}</th>
          <th className={styles.val}>{i18n.value}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default SetElementTable;

export interface SetElementTableProps {
  setId: string;
}
