import React from "react";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MdFilterList } from "@react-icons/all-files/md/MdFilterList";

import styles from "./Table2.module.scss";

export const TableSearch: React.FC<TableSearchProps> = ({ children }) => {
  return (
    <div className={styles.tableSearch}>
      <div className={styles.guide}>
        <MdFilterList />
        <span>Filter</span>
      </div>
      {children}
    </div>
  );
};

function Table2<T>({ data, columns, headless, footer }: Table2Props<T>) {
  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.wrapper}>
      <table>
        {headless ? null : (
          <thead className={styles.tableHeader}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr className={styles.tableRow} key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr className={styles.tableRow} key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer ? (
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr className={styles.tableRow} key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.footer, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

export default Table2;

export interface Table2Props<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  headless?: boolean;
  footer?: boolean;
}

export interface RecordData {
  label: string;
  value: any;
}

export interface TableSearchProps {
  children: React.ReactNode;
}
