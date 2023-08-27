import React from "react";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./SetDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Table2, { RecordData, Table2Body, Table2Head } from "@/components/table2/Table2";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

const columnHelper = createColumnHelper<RecordData>();

const columns = [
  columnHelper.accessor("label", {
    cell: info => <div className={styles.label}>{info.getValue()}</div>,
  }),
  columnHelper.accessor(row => row.value, {
    id: "Value",
    cell: info => info.getValue(),
  }),
];

const SetDetailTable: React.FC<SetDetailTableProps> = ({ prfsSet }) => {
  const i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    if (!prfsSet) {
      return [];
    }

    const ret: RecordData[] = [
      {
        label: i18n.set_id,
        value: prfsSet.set_id,
      },
      {
        label: i18n.description,
        value: prfsSet.desc,
      },
      {
        label: i18n.label,
        value: prfsSet.label,
      },
      {
        label: i18n.cardinality,
        value: prfsSet.cardinality,
      },
      {
        label: i18n.element_type,
        value: prfsSet.element_type,
      },
      {
        label: i18n.author,
        value: prfsSet.author,
      },
      {
        label: i18n.hash_algorithm,
        value: prfsSet.hash_algorithm,
      },
      {
        label: i18n.elliptic_curve,
        value: prfsSet.elliptic_curve,
      },
      {
        label: i18n.finite_field,
        value: prfsSet.finite_field,
      },
      {
        label: i18n.merkle_root,
        value: prfsSet.merkle_root,
      },
      {
        label: i18n.created_at,
        value: prfsSet.created_at,
      },
    ];

    return ret;
  }, [prfsSet]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    prfsSet && (
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

export default SetDetailTable;

interface SetDetailTableProps {
  prfsSet: PrfsSet | undefined;
}
