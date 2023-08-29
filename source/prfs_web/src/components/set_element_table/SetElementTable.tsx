import React from "react";
import cn from "classnames";
import * as prfsApi from "@taigalabs/prfs-api-js";
import {
  Row,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

import styles from "./SetElementTable.module.scss";
import Table2, {
  Table2Body,
  Table2Head,
  Table2Pagination,
  TableSearch,
} from "@/components/table2/Table2";
import { EditableCell } from "./TableCell";
import { i18nContext } from "@/contexts/i18n";

const columnHelper = createColumnHelper<PrfsTreeNode>();

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

const SetElementTable: React.FC<SetElementTableProps> = ({ setId, prfsSet, editable }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<PrfsTreeNode[]>(() => []);

  const columns = React.useMemo<ColumnDef<PrfsTreeNode, any>[]>(
    () => [
      columnHelper.accessor("pos_w", {
        header: "Position",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("val", {
        header: "Value",
        cell: editable ? EditableCell : ctx => ctx.getValue(),
        meta: {
          type: "text",
        },
      }),
    ],
    []
  );

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
    }

    fn().then();
  }, [setId, setData, pageIndex, pageSize]);

  const pagination = React.useMemo(() => {
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    pageCount: prfsSet ? Math.ceil(Number(prfsSet.cardinality) / pageSize) : -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    autoResetPageIndex,
    meta: {
      cardinality: prfsSet ? Number(prfsSet.cardinality) : -1,
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    prfsSet && (
      <div className={styles.wrapper}>
        <div className={styles.tableContainer}>
          <TableSearch>
            <input placeholder={i18n.set_search_guide} />
          </TableSearch>

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
                    <td
                      className={cn({
                        [styles.pos_w]: cell.column.id === "pos_w",
                        [styles.value]: cell.column.id === "value",
                      })}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </Table2Body>
          </Table2>

          {/* <pre>{JSON.stringify(data, null, "\t")}</pre> */}
        </div>
        <Table2Pagination table={table} />
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
