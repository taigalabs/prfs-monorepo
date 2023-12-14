import React from "react";
import { useRouter } from "next/navigation";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { PrfsPollResponse } from "@taigalabs/prfs-entities/bindings/PrfsPollResponse";
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";

import styles from "./PollResultView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const Response: React.FC<ResponseProps> = ({ row }) => {
  return (
    <div className={styles.response}>
      {row.getVisibleCells().map(cell => {
        return (
          <div className={styles.cell} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        );
      })}
    </div>
  );
};

const PollResultView: React.FC<PollResultViewProps> = ({ poll_responses }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const columns = React.useMemo<ColumnDef<PrfsPollResponse>[]>(
    () => [
      {
        accessorFn: row => row.proof_instance_id,
        header: "Proof instance Id",
      },
      {
        accessorFn: row => row.serial_no,
        header: "Serial no",
      },
      {
        accessorFn: row => row.value,
        header: "Value",
      },
      // {
      //   accessorFn: row => row.created_at,
      //   header: "Created At",
      //   cell: info => {
      //     const val = info.getValue() as string;
      //     const day = dayjs(val);
      //     return day.format("YYYY-MM-DD");
      //   },
      // },
    ],
    [],
  );

  const table = useReactTable({
    data: poll_responses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.wrapper}>
      {table.getRowModel().rows.map(row => {
        return <Response key={row.id} row={row} />;
      })}
    </div>
  );
};

export default PollResultView;

export interface PollResultViewProps {
  poll_responses: PrfsPollResponse[];
}

export interface ResponseProps {
  row: Row<PrfsPollResponse>;
}
