"use client";

import React from "react";
import Link from "next/link";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import styles from "./CircuitInputTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Table2, { Table2Body, Table2Head } from "@/components/table2/Table2";

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
        header: i18n.description,
        accessorFn: row => row.desc,
        cell: info => info.getValue(),
      },
      {
        header: i18n.reference,
        accessorFn: row => row.ref,
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
          <tr>
            <th>{i18n.type}</th>
            <th>{i18n.label}</th>
            <th>{i18n.value}</th>
            <th>{i18n.reference}</th>
          </tr>
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
