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

const SetElementTable2: React.FC<SetElementTable2Props> = ({ setId }) => {
  const rerender = React.useReducer(() => ({}), {})[1];
  const [data, setData] = React.useState<PrfsTreeNode[]>([]);

  const columns = React.useMemo<ColumnDef<PrfsTreeNode>[]>(
    () => [
      {
        header: "Info",
        accessorFn: row => row.pos_w,
        cell: info => info.getValue(),
      },
      {
        header: "Value",
        accessorFn: row => row.val,
      },
    ],
    []
  );

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

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
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

        <Table2Pagination>
          <button
            className={styles.first}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            first
          </button>
          <button
            className={styles.prev}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            prev
          </button>
          <button
            className={styles.next}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            next
          </button>
          <button
            className={styles.last}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            last
          </button>
        </Table2Pagination>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div>{table.getRowModel().rows.length} Rows</div>
        <pre>{JSON.stringify(pagination, null, 2)}</pre>
      </Table2>
    </div>
  );
};

export default SetElementTable2;

export interface SetElementTable2Props {
  setId: string;
}
