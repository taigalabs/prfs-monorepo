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
import KeyboardDoubleArrowLeft from "@taigalabs/prfs-react-components/src/material_icons/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRight from "@taigalabs/prfs-react-components/src/material_icons/KeyboardDoubleArrowRight";
import KeyboardArrowLeft from "@taigalabs/prfs-react-components/src/material_icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@taigalabs/prfs-react-components/src/material_icons/KeyboardArrowRight";

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
      <div className={styles.rowsPerPage}>
        <span>{i18n.rows_per_page}</span>
        <select
          value={pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {pageSizeSelectElem}
        </select>
      </div>
      <div className={styles.pageLocation}>
        <div>{pageLocation}</div>
      </div>
      <div className={styles.arrowGroup}>
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

export default Table2;

export interface Table2Props {
  children: React.ReactNode;
}

export interface Table2PaginationProps<T> {
  table: Table<T>;
  pageSize: number;
}

export interface RecordData {
  label: string;
  value: any;
}

export interface TableSearchProps {
  children: React.ReactNode;
}
