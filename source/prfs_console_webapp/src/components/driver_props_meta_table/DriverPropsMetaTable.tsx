import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { DriverPropertyMeta } from "@taigalabs/prfs-entities/bindings/DriverPropertyMeta";
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
} from "@taigalabs/prfs-react-lib/src/table2/Table2";

import styles from "./DriverPropsMetaTable.module.scss";
import { i18nContext } from "@/i18n/context";

const DriverPropsMetaTable: React.FC<DriverPropsMetaTableProps> = ({ driverPropsMeta }) => {
  const i18n = React.useContext(i18nContext);

  const columns = React.useMemo(() => {
    const cols: ColumnDef<DriverPropertyMeta>[] = [
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
    ];

    return cols;
  }, [i18n]);

  const [data, setData] = React.useState<DriverPropertyMeta[]>([]);

  React.useEffect(() => {
    if (driverPropsMeta) {
      setData(driverPropsMeta);
    }
  }, [setData, driverPropsMeta]);

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

export default DriverPropsMetaTable;

export interface DriverPropsMetaTableProps {
  driverPropsMeta: DriverPropertyMeta[] | undefined;
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
