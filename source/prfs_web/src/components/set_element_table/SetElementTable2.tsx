import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";

import styles from "./SetElementTable2.module.scss";
import Table2, { Table2Body, Table2Head, Table2Pagination } from "../table2/Table2";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

const columns: ColumnDef<PrfsTreeNode>[] = [
  {
    header: "Info",
    accessorFn: row => row.pos_w,
    cell: info => info.getValue(),
  },
  {
    header: "Value",
    accessorFn: row => row.val,
  },
];

const SetElementTable2: React.FC<SetElementTable2Props> = ({ setId, prfsSet }) => {
  // const rerender = React.useReducer(() => ({}), {})[1];
  const [data, setData] = React.useState<PrfsTreeNode[]>([]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useMemo(async () => {
    console.log(111, pageIndex, pageSize);

    const { payload } = await prfsApi.getSetElements({
      page_idx: pageIndex,
      page_size: pageSize,
      set_id: setId,
    });

    const { prfs_tree_nodes } = payload;

    setData(prfs_tree_nodes);
  }, [setId, setData, pageIndex, pageSize]);

  const pagination = React.useMemo(() => {
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    data,
    columns,
    pageCount: prfsSet ? Number(prfsSet.cardinality) : -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    prfsSet && (
      <div className={styles.wrapper}>
        <Table2>
          <Table2Head>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </Table2Head>

          <Table2Body>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </Table2Body>
        </Table2>

        <Table2Pagination table={table} pageSize={pageSize} />
      </div>
    )
  );
};

export default SetElementTable2;

export interface SetElementTable2Props {
  setId: string;
  prfsSet: PrfsSet | undefined;
}
