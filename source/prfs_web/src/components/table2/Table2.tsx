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

export const Table2: React.FC<Table2Props> = ({ children }) => {
  return <table className={styles.table2}>{children}</table>;
};

export const Table2Head: React.FC<Table2Props> = ({ children }) => {
  return <thead className={styles.table2Head}>{children}</thead>;
};

export const Table2Body: React.FC<Table2Props> = ({ children }) => {
  return <tbody className={styles.table2Body}>{children}</tbody>;
};

export const Table2Pagination: React.FC<Table2Props> = ({ children }) => {
  return <div className={styles.table2Pagination}>{children}</div>;
};

export function Table2Component<T>({ data, columns, headless, footer }: Table2ComponentProps<T>) {
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
          <thead className={styles.table2Head}>
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

export interface Table2Props {
  children: React.ReactNode;
}

export interface Table2ComponentProps<T> {
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
