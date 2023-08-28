import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import styles from "./SetTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Table2, {
  Table2Body,
  Table2Head,
  Table2Pagination,
  TableSearch,
} from "@/components/table2/Table2";

const SetTable: React.FC<SetTableProps> = ({ selectType, selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<PrfsSet[]>([]);
  const router = useRouter();

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsSet>[] = [
      {
        id: "set_id",
        header: i18n.set_id,
        accessorFn: row => row.set_id,
        cell: info => info.getValue(),
      },
      {
        id: "label",
        accessorFn: row => row.label,
        cell: info => info.getValue(),
      },
      {
        id: "desc",
        accessorFn: row => row.desc,
        cell: info => info.getValue(),
      },
      {
        id: "cardinality",
        accessorFn: row => row.cardinality,
        cell: info => info.getValue(),
      },
      {
        id: "created_at",
        accessorFn: row => row.created_at,
        cell: info => {
          return dayjs(info.getValue() as string).format("YYYY-MM-DD");
        },
      },
    ];

    return cols;
  }, [i18n]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi.getPrfsSets({
        page_idx: pageIndex,
        page_size: 20,
      });

      setData(payload.prfs_sets);
    }

    fn().then();
  }, [setData, pageIndex, pageSize]);

  const pagination = React.useMemo(() => {
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className={styles.wrapper}>
      <TableSearch>
        <input placeholder={i18n.set_search_guide} />
      </TableSearch>
      <Table2>
        <Table2Head>
          <tr>
            <th className={styles.set_id}>{i18n.set_id}</th>
            <th className={styles.label}>{i18n.label}</th>
            <th className={styles.desc}>{i18n.description}</th>
            <th className={styles.cardinality}>{i18n.cardinality}</th>
            <th className={styles.createdAt}>{i18n.created_at}</th>
          </tr>
        </Table2Head>

        <Table2Body>
          {table.getRowModel().rows.map(row => {
            const setId = row.getValue("set_id") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  router.push(`${paths.proof__sets}/${setId}`);
                }}
              >
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
      </Table2>

      <Table2Pagination table={table} />
    </div>
  );
};

export default SetTable;

export interface SetTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsSet;
  handleSelectVal?: (row: PrfsSet) => void;
}
