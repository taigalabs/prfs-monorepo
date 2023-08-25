import React from "react";
import ReactDOM from "react-dom/client";
import * as prfsApi from "@taigalabs/prfs-api-js";
import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

// import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import styles from "./SetElementTable2.module.scss";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";

const SetElementTable2: React.FC<SetElementTable2Props> = ({ setId, prfsSet }) => {
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
    pageSize: 10,
  });

  // const fetchDataOptions = {
  //   pageIndex,
  //   pageSize,
  // };

  // const dataQuery = useQuery(["data", fetchDataOptions], () => fetchData(fetchDataOptions), {
  //   keepPreviousData: true,
  // });

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
    debugTable: true,
  });

  return (
    <div className={styles.wrapper}>
      <div className="h-2" />
      <table>
        <thead>
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
        </thead>
        <tbody>
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
        </tbody>
      </table>

      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          first
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          prev
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          next
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          last
        </button>
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
        {/* {dataQuery.isFetching ? "Loading..." : null} */}
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <pre>{JSON.stringify(pagination, null, 2)}</pre>
    </div>
  );
};

export default SetElementTable2;

export interface SetElementTable2Props {
  setId: string;
}
