import React from "react";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./CircuitTypeDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Table2, { RecordData, Table2Body, Table2Head } from "@/components/table2/Table2";
import { PrfsCircuitType } from "@taigalabs/prfs-entities/bindings/PrfsCircuitType";

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

const CircuitTypeDetailTable: React.FC<CircuitTypeDetailTableProps> = ({ circuit_type }) => {
  const i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    if (!circuit_type) {
      return [];
    }

    const ret: RecordData[] = [
      {
        label: i18n.circuit_type,
        value: circuit_type.circuit_type,
      },
      {
        label: i18n.description,
        value: circuit_type.desc,
      },
      {
        label: i18n.author,
        value: circuit_type.author,
      },
      {
        label: i18n.created_at,
        value: circuit_type.created_at,
      },
    ];

    return ret;
  }, [circuit_type]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    circuit_type && (
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

export default CircuitTypeDetailTable;

interface CircuitTypeDetailTableProps {
  circuit_type: PrfsCircuitType | undefined;
}
