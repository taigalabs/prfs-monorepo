import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import * as prfsApi from "@taigalabs/prfs-api-js";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table2, {
  RecordData,
  Table2Body,
  Table2Head,
} from "@taigalabs/prfs-react-components/src/table2/Table2";

import styles from "./DriverPropsTable.module.scss";
import { i18nContext } from "@/contexts/i18n";

const DriverPropsTable: React.FC<DriverPropsTableProps> = ({
  driver_properties,
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    const ret: RecordData[] = [];

    for (const [key, val] of Object.entries(driver_properties)) {
      ret.push({
        label: key,
        value: val,
      });
    }

    return ret;
  }, [driver_properties]);

  const columns = React.useMemo(() => {
    const cols: ColumnDef<RecordData>[] = [
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
    ];

    return cols;
  }, [i18n]);

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
            <th>{i18n.label}</th>
            <th>{i18n.value}</th>
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

export default DriverPropsTable;

interface DriverPropsTableProps {
  driver_properties: Record<string, any>;
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
