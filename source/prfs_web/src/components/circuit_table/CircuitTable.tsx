import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
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

import styles from "./CircuitTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Table2, {
  Table2Body,
  Table2Head,
  Table2Pagination,
  TableSearch,
} from "@/components/table2/Table2";

const CircuitTable: React.FC<CircuitTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsCircuit>[] = [
      {
        id: "circuit_id",
        header: i18n.circuit_id,
        accessorFn: row => row.circuit_id,
        cell: info => info.getValue(),
      },
      {
        header: i18n.label,
        accessorFn: row => row.label,
        cell: info => info.getValue(),
      },
      {
        header: i18n.description,
        accessorFn: row => row.desc,
        cell: info => info.getValue(),
      },
      {
        header: i18n.author,
        accessorFn: row => row.author,
        cell: info => info.getValue(),
      },
      {
        header: i18n.created_at,
        accessorFn: row => row.created_at,
        cell: info => {
          const val = info.getValue() as any;
          const createdAt = dayjs(val).format("YYYY-MM-DD");
          return createdAt;
        },
      },
    ];

    return cols;
  }, [i18n]);

  const [data, setData] = React.useState<PrfsCircuit[]>([]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi.getPrfsCircuits({
        page_idx: pageIndex,
        page_size: pageSize,
      });

      setData(payload.prfs_circuits_syn1);
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
        <input placeholder={i18n.circuit_search_guide} />
      </TableSearch>
      <Table2>
        <Table2Head>
          <tr>
            <th>{i18n.circuit_id}</th>
            <th>{i18n.label}</th>
            <th>{i18n.description}</th>
            <th>{i18n.author}</th>
            <th>{i18n.created_at}</th>
          </tr>
        </Table2Head>

        <Table2Body>
          {table.getRowModel().rows.map(row => {
            const circuitId = row.getValue("circuit_id") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  router.push(`${paths.proof__circuits}/${circuitId}`);
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

export default CircuitTable;

export interface CircuitTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
