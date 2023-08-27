import React from "react";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./DriverDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Table2, { RecordData, Table2Body, Table2Head } from "@/components/table2/Table2";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";

const columnHelper = createColumnHelper<RecordData>();

const columns = [
  columnHelper.accessor("label", {
    cell: info => <div className={styles.label}>{info.getValue()}</div>,
  }),
  columnHelper.accessor(row => row.value, {
    id: "value",
    cell: info => info.getValue(),
  }),
];

const DriverDetailTable: React.FC<DriverDetailTableProps> = ({ driver }) => {
  const i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    if (!driver) {
      return [];
    }

    const ret: RecordData[] = [
      {
        label: i18n.circuit_driver_id,
        value: driver.circuit_driver_id,
      },
      {
        label: i18n.driver_repository_url,
        value: driver.driver_repository_url,
      },
      {
        label: i18n.version,
        value: driver.version,
      },
      {
        label: i18n.author,
        value: driver.author,
      },
      {
        label: i18n.description,
        value: driver.desc,
      },
      {
        label: i18n.created_at,
        value: driver.created_at,
      },
    ];

    return ret;
  }, [driver]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    driver && (
      <div className={styles.wrapper}>
        <Table2>
          <Table2Head>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </Table2Head>

          <Table2Body>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id}>
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
      </div>
    )
  );
};

export default DriverDetailTable;

interface DriverDetailTableProps {
  driver: PrfsCircuitDriver | undefined;
}
