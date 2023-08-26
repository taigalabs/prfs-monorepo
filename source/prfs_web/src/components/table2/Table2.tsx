import React from "react";
import {
  ColumnDef,
  Table,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MdFilterList } from "@react-icons/all-files/md/MdFilterList";
// import { MdKeyboardArrowLeft } from "@react-icons/all-files/md/MdKeyboardArrowLeft";
import KeyboardDoubleArrowLeft from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRight from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import styles from "./Table2.module.scss";
import { i18nContext } from "@/contexts/i18n";

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

export function Table2Pagination<T>({ table, pageSize }: Table2PaginationProps<T>) {
  const i18n = React.useContext(i18nContext);
  const { pagination } = table.getState();

  const pageSizeSelectElem = React.useMemo(() => {
    return (
      <>
        {[10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </>
    );
  }, []);

  const pageLocation = React.useMemo(() => {
    const { pageSize, pageIndex } = pagination;

    const elemStartNo = pageIndex * pageSize + 1;
    const elemEndNo = (pageIndex + 1) * pageSize;
    return `${elemStartNo} - ${elemEndNo} of ${table.getPageCount()}`;
  }, [pagination]);

  return (
    <div className={styles.table2Pagination}>
      <div>
        {i18n.rows_per_page}
        <select
          value={pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {pageSizeSelectElem}
        </select>
      </div>
      <div>
        <div>{pageLocation}</div>
      </div>
      <div>
        <button
          className={styles.first}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <KeyboardDoubleArrowLeft />
        </button>
        <button
          className={styles.prev}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <KeyboardArrowLeft />
        </button>
        <button
          className={styles.next}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <KeyboardArrowRight />
        </button>
        <button
          className={styles.last}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <KeyboardDoubleArrowRight />
        </button>
      </div>
    </div>
  );
}

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

export interface Table2PaginationProps<T> {
  table: Table<T>;
  pageSize: number;
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
