import React from "react";
import Link from "next/link";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsCircuitType } from "@taigalabs/prfs-entities/bindings/PrfsCircuitType";
import dayjs from "dayjs";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import styles from "./CircuitTypeTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Table2, {
  Table2Body,
  Table2Head,
  Table2Pagination,
  TableSearch,
} from "@/components/table2/Table2";

const CircuitTypeTable: React.FC<CircuitTypeTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsCircuitType>[] = [
      {
        id: "circuit_type",
        header: i18n.circuit_type,
        accessorFn: row => row.circuit_type,
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

  const [data, setData] = React.useState<PrfsCircuitType[]>([]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi2("get_prfs_circuit_types", {
        page_idx: pageIndex,
        page_size: pageSize,
      });

      const { prfs_circuit_types } = payload;

      setData(prfs_circuit_types);
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
        <input placeholder={i18n.circuit_type_search_guide} />
      </TableSearch>
      <Table2>
        <Table2Head>
          <tr>
            <th className={styles.circuit_type}>{i18n.circuit_type}</th>
            <th className={styles.desc}>{i18n.description}</th>
            <th className={styles.author}>{i18n.author}</th>
            <th className={styles.createdAt}>{i18n.created_at}</th>
          </tr>
        </Table2Head>

        <Table2Body>
          {table.getRowModel().rows.map(row => {
            const circuitType = row.getValue("circuit_type") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  router.push(`${paths.circuit_types}/${circuitType}`);
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

export default CircuitTypeTable;

export interface CircuitTypeTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuitType;
  handleSelectVal?: (row: PrfsCircuitType) => void;
}
