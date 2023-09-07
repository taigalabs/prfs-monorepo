import React from "react";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table2, { Table2Body, Table2Head } from "@taigalabs/prfs-react-components/src/table2/Table2";

import styles from "./CircuitInputsMetaTable.module.scss";
import { i18nContext } from "@/contexts/i18n";

const CircuitInputsMetaTable: React.FC<CircuitInputsMetaTableProps> = ({
  circuit_inputs_meta,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);

  const columns = React.useMemo(() => {
    const cols: ColumnDef<CircuitInputMeta>[] = [
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

  const [data, setData] = React.useState<CircuitInputMeta[]>(circuit_inputs_meta);

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
            <th>{i18n.description}</th>
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

export default CircuitInputsMetaTable;

export interface CircuitInputsMetaTableProps {
  circuit_inputs_meta: CircuitInputMeta[];
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
