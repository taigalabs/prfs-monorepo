import React from "react";
import Link from "next/link";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import styles from "./DriverTable.module.scss";
import Table2, {
  Table2Body,
  Table2Head,
  Table2Pagination,
  TableSearch,
} from "@/components/table2/Table2";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const DriverTable: React.FC<DriverTableProps> = ({ selectType, selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsCircuitDriver>[] = [
      {
        id: "circuit_driver_id",
        header: i18n.circuit_driver_id,
        accessorFn: row => row.circuit_driver_id,
        cell: info => info.getValue(),
      },
      {
        header: i18n.driver_repository_url,
        accessorFn: row => row.driver_repository_url,
        cell: info => info.getValue(),
      },
      {
        header: i18n.version,
        accessorFn: row => row.version,
        cell: info => info.getValue(),
      },
    ];

    return cols;
  }, [i18n]);

  const [data, setData] = React.useState<PrfsCircuitDriver[]>([]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi2("get_prfs_circuit_drivers", {
        page_idx: pageIndex,
        page_size: pageSize,
      });

      const { prfs_circuit_drivers } = payload;

      setData(prfs_circuit_drivers);
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
        <input placeholder={i18n.proof} />
      </TableSearch>
      <Table2>
        <Table2Head>
          <tr>
            <th className={styles.driver_id}>{i18n.circuit_driver_id}</th>
            <th className={styles.driver_repository_url}>{i18n.driver_repository_url}</th>
            <th className={styles.version}>{i18n.version}</th>
          </tr>
        </Table2Head>

        <Table2Body>
          {table.getRowModel().rows.map(row => {
            const circuit_driver_id = row.getValue("circuit_driver_id") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  router.push(`${paths.circuit_drivers}/${circuit_driver_id}`);
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

export default DriverTable;

export interface DriverTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuitDriver;
  handleSelectVal?: (row: PrfsCircuitDriver) => void;
}
