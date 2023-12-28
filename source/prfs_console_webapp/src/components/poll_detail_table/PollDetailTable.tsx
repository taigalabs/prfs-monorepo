import React from "react";
import cn from "classnames";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table2, { RecordData, Table2Body } from "@taigalabs/prfs-react-components/src/table2/Table2";
import Link from "next/link";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";

import styles from "./PollDetailTable.module.scss";
import { i18nContext } from "@/i18n/context";

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

const PollDetailTable: React.FC<PollDetailTableProps> = ({ poll }) => {
  const i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    const ret: RecordData[] = [
      {
        label: i18n.poll_id,
        value: poll.poll_id,
      },
      {
        label: i18n.label,
        value: poll.label,
      },
      {
        label: i18n.plural_voting,
        value: poll.plural_voting === true ? "Plural" : "",
      },
      {
        label: i18n.proof_type_id,
        value: poll.proof_type_id,
      },
      {
        label: i18n.created_at,
        value: poll.created_at,
      },
    ];

    return ret;
  }, [poll]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
  );
};

export default PollDetailTable;

export interface PollDetailTableProps {
  poll: PrfsPoll;
}
