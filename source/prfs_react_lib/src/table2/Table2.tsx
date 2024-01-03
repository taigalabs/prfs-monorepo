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
import MiKeyboardArrowLeft from "../material_icons/MiKeyboardArrowLeft";
import MiKeyboardArrowRight from "../material_icons/MiKeyboardArrowRight";
import MiKeyboardDoubleArrowLeft from "../material_icons/MiKeyboardDoubleArrowLeft";
import MiKeyboardDoubleArrowRight from "../material_icons/MiKeyboardDoubleArrowRight";

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

export const PaddedTableWrapper: React.FC<PaddedTableWrapperProps> = ({ children }) => {
  return <div className={styles.paddedTableWrapper}>{children}</div>;
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

export function Table2Pagination<T>({ table }: Table2PaginationProps<T>) {
  const { pagination } = table.getState();

  const pageSizeSelectElem = React.useMemo(() => {
    return (
      <>
        {[10, 20, 30, 40, 50, 100].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </>
    );
  }, []);

  const pageLocation = React.useMemo(() => {
    const { pageSize, pageIndex } = pagination;
    const { meta } = table.options;

    const cardinality = meta && (meta as Table2Meta).cardinality;

    const elemStartNo = pageIndex * pageSize + 1;
    const elemEndNo = cardinality
      ? Math.min(cardinality, (pageIndex + 1) * pageSize)
      : (pageIndex + 1) * pageSize;

    return `${elemStartNo} - ${elemEndNo} ${cardinality ? "of " + cardinality : ""}`;
  }, [pagination, table]);

  return (
    <div className={styles.table2Pagination}>
      <div className={styles.rowsPerPage}>
        <span>Rows per page</span>
        <select
          value={pagination.pageSize}
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
          <MiKeyboardDoubleArrowLeft />
        </button>
        <button
          className={styles.prev}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <MiKeyboardArrowLeft />
        </button>
        <button
          className={styles.next}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <MiKeyboardArrowRight />
        </button>
        <button
          className={styles.last}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <MiKeyboardDoubleArrowRight />
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
}

export interface RecordData {
  label: string;
  value: any;
}

export interface TableSearchProps {
  children: React.ReactNode;
}

export interface Table2Meta {
  cardinality: number;
}

export interface PaddedTableWrapperProps {
  children: React.ReactNode;
}
