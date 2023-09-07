"use client";

import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Table2, { Table2Body, Table2Head } from "@taigalabs/prfs-react-components/src/table2/Table2";

import styles from "./CircuitInputTable.module.scss";
import { i18nContext } from "@/contexts/i18n";

const CircuitInputTable: React.FC<CircuitInputTableProps> = ({ circuit_inputs }) => {
  const i18n = React.useContext(i18nContext);

  const columns = React.useMemo(() => {
    const cols: ColumnDef<CircuitInput>[] = [
      {
        header: i18n.type,
        accessorFn: row => row.type,
        cell: info => info.getValue(),
      },
      {
        header: i18n.label,
        accessorFn: row => row.label,
        cell: info => info.getValue(),
      },
      {
        header: i18n.value,
        accessorFn: row => row.value,
        cell: info => info.getValue(),
      },
      {
        header: i18n.ref_type,
        accessorFn: row => row.ref_type,
        cell: info => info.getValue(),
      },
      {
        header: i18n.ref_value,
        accessorFn: row => row.ref_value,
        cell: info => info.getValue(),
      },
    ];

    return cols;
  }, [i18n]);

  const [data, setData] = React.useState<CircuitInput[]>([]);

  React.useEffect(() => {
    setData(circuit_inputs);
  }, [circuit_inputs]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
  );
};

export default CircuitInputTable;

export interface CircuitInputTableProps {
  circuit_inputs: CircuitInput[];
}
