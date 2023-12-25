import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { IoIosArrowBack } from "@react-icons/all-files/io/IoIosArrowBack";
import { IoIosArrowForward } from "@react-icons/all-files/io/IoIosArrowForward";

import styles from "./TwitterAccAtstTable.module.scss";

import { fetchData, Person } from "./fetchData";

const defaultData: any[] = [];

const TwitterAccAtstTable: React.FC = () => {
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.lastName,
        id: "lastName",
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: "status",
        header: "Status",
        footer: props => props.column.id,
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        footer: props => props.column.id,
      },
    ],
    [],
  );

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchDataOptions = {
    pageIndex,
    pageSize,
  };

  const dataQuery = useQuery({
    queryKey: ["data"],
    queryFn: () => fetchData(fetchDataOptions),
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    pageCount: dataQuery.data?.pageCount ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    debugTable: true,
  });

  const { firstRowIdx, lastRowIdx } = React.useMemo(() => {
    const firstRowIdx = pageIndex === 0 ? 1 : (pageIndex + 1) * pageSize;
    const rowCount = table.getRowModel().rows.length;

    return {
      firstRowIdx,
      lastRowIdx: firstRowIdx + rowCount - 1,
    };
  }, [pageIndex, pageSize, table.getRowModel()]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.navigation}>
        <div className={styles.location}>
          {firstRowIdx} - {lastRowIdx}
        </div>
        <div className={styles.btnGroup}>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <IoIosArrowBack />
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <IoIosArrowForward />
          </button>
        </div>
      </div>
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
      {dataQuery.isFetching ? "Loading..." : null}
    </div>
  );
};

export default TwitterAccAtstTable;
