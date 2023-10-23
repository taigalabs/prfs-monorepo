import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table2, { Table2Body } from "@taigalabs/prfs-react-components/src/table2/Table2";

import styles from "./SupportingCircuitTypeTable.module.scss";
import { i18nContext } from "@/contexts/i18n";

const SupportingCircuitTypeTable: React.FC<SupportingCircuitTypeTableProps> = ({
  circuit_type_ids,
}) => {
  const i18n = React.useContext(i18nContext);

  const columns = React.useMemo(() => {
    const cols: ColumnDef<string>[] = [
      {
        id: "value",
        accessorFn: row => row,
        cell: info => info.getValue(),
      },
    ];

    return cols;
  }, [i18n]);

  const [data, setData] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (circuit_type_ids) {
      setData(circuit_type_ids);
    }
  }, [, setData, circuit_type_ids]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    circuit_type_ids && (
      <div className={styles.wrapper}>
        <Table2>
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

export default SupportingCircuitTypeTable;

export interface SupportingCircuitTypeTableProps {
  circuit_type_ids: string[] | undefined;
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
