import React from "react";
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

import styles from "./PublicInputTable.module.scss";
import { i18nContext } from "@/i18n/context";

const LEVEL2_PREFIX = "$2__";

const PublicInputTable: React.FC<PublicInputTableProps> = ({ publicInputs }) => {
  let i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    const ret: RecordData[] = [];

    for (const [key, val] of Object.entries(publicInputs)) {
      if (typeof val === "object" && !Array.isArray(val) && val !== null) {
        ret.push({
          label: key,
          value: "",
        });

        for (const [key2, val2] of Object.entries(val)) {
          ret.push({
            label: LEVEL2_PREFIX + key2,
            value: JSON.stringify(val2),
          });
        }
      } else {
        ret.push({
          label: key,
          value: val,
        });
      }
    }

    return ret;
  }, [publicInputs]);

  const columns = React.useMemo(() => {
    const cols: ColumnDef<Record<string, any>>[] = [
      {
        id: "label",
        accessorFn: row => row.label,
        cell: info => {
          const label = info.getValue() as string;

          if (label.startsWith(LEVEL2_PREFIX)) {
            return <p className={styles.level2}>{label.substring(4)}</p>;
          } else {
            return <p>{label}</p>;
          }
        },
      },
      {
        id: "value",
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

export default PublicInputTable;

export interface PublicInputTableProps {
  publicInputs: Record<string, any>;
}
