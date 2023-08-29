import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";

import styles from "./SetElementTable.module.scss";
import Table2, { Table2Body, Table2Head, Table2Pagination } from "@/components/table2/Table2";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

import { FooterCell } from "./FooterCell";
import { TableCell } from "./TableCell";
import { EditCell } from "./EditCell";

const columnHelper = createColumnHelper<PrfsTreeNode>();

const columns: ColumnDef<PrfsTreeNode, any>[] = [
  // {
  //   header: "Position",
  //   accessorFn: row => row.pos_w,
  //   cell: info => info.getValue(),
  // },
  // {
  //   header: "Value",
  //   accessorFn: row => row.val,
  // },
  columnHelper.accessor("pos_w", {
    header: "Position",
    cell: TableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("val", {
    header: "Value",
    cell: TableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.display({
    id: "edit",
    cell: EditCell,
  }),
];

const SetElementTable: React.FC<SetElementTableProps> = ({ setId, prfsSet, editable }) => {
  const [data, setData] = React.useState<PrfsTreeNode[]>(() => []);
  const [originalData, setOriginalData] = React.useState<PrfsTreeNode[]>(() => []);
  const [editedRows, setEditedRows] = React.useState({});

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi.getPrfsTreeLeafNodesBySetId({
        page_idx: pageIndex,
        page_size: pageSize,
        set_id: setId,
      });

      const { prfs_tree_nodes } = payload;

      setData(prfs_tree_nodes);
      setOriginalData(() => [...prfs_tree_nodes]);
    }

    fn().then();
  }, [setId, setData, pageIndex, pageSize, setOriginalData]);

  const pagination = React.useMemo(() => {
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    meta: {
      cardinality: prfsSet ? Number(prfsSet.cardinality) : -1,
      editedRows,
      setEditedRows,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData(old =>
            old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row))
          );
        } else {
          setOriginalData(old =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          );
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
      addRow: () => {
        const setFunc = (old: PrfsTreeNode[]) => {
          console.log("old len", old.length);

          const newRow: PrfsTreeNode = {
            pos_w: 0,
            pos_h: 0,
            val: "",
            set_id: setId,
          };

          return [...old, newRow];
        };

        setEditedRows((prev: any) => ({
          ...prev,
          [data.length]: true,
        }));

        setData(setFunc);
        setOriginalData(setFunc);
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: PrfsTreeNode[]) =>
          old.filter((_row: PrfsTreeNode, index: number) => index !== rowIndex);

        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
      removeSelectedRows: (selectedRows: number[]) => {
        const setFilterFunc = (old: PrfsTreeNode[]) =>
          old.filter((_row, index) => !selectedRows.includes(index));

        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
    },
    data,
    columns,
    pageCount: prfsSet ? Math.ceil(Number(prfsSet.cardinality) / pageSize) : -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  console.log(22, editedRows);

  return (
    prfsSet && (
      <div className={styles.wrapper}>
        <Table2>
          <Table2Head>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </Table2Head>

          <Table2Body>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </Table2Body>

          <tfoot>
            <tr>
              <th colSpan={table.getCenterLeafColumns().length} align="right">
                <FooterCell table={table} />
              </th>
            </tr>
          </tfoot>
        </Table2>

        <Table2Pagination table={table} />

        {/* <pre>{JSON.stringify(data, null, "\t")}</pre> */}
      </div>
    )
  );
};

export default SetElementTable;

export interface SetElementTableProps {
  setId: string;
  prfsSet: PrfsSet | undefined;
  editable?: boolean;
}
