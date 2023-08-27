import React from "react";
import Link from "next/link";
import cn from "classnames";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import Table, {
  TableBody,
  TableHeader,
  TableRecordData,
  TableRow,
} from "@taigalabs/prfs-react-components/src/table/Table";
import { AiFillCheckCircle } from "@react-icons/all-files/ai/AiFillCheckCircle";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import dayjs from "dayjs";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./ProofInstanceDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import Table2, { RecordData, Table2Body } from "../table2/Table2";

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

const ProofInstanceDetailTable: React.FC<ProofInstanceDetailTableProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  // const [data, _] = React.useState<TableRecordData<PrfsProofInstanceSyn1>>({
  //   record: proofInstance,
  // });

  const url = React.useMemo(() => {
    return `${process.env.NEXT_PUBLIC_PRFS_WEB_ENDPOINT}/p/${proofInstance.short_id}`;
  }, [proofInstance]);

  const handleClickCopy = React.useCallback(() => {
    navigator.clipboard.writeText(url);
  }, [url]);

  const createCopyButton = React.useCallback(
    (_: boolean) => {
      return (
        <button onClick={handleClickCopy}>
          <AiOutlineCopy />
        </button>
      );
    },
    [url]
  );

  const createCopyButtonTooltip = React.useCallback(
    (_: React.Dispatch<React.SetStateAction<any>>) => {
      return <div className={styles.copyBtnTooltip}>{i18n.url_is_copied}</div>;
    },
    []
  );

  const data = React.useMemo(() => {
    if (!proofInstance) {
      return [];
    }

    const url = `${process.env.NEXT_PUBLIC_PRFS_WEB_ENDPOINT}/p/${proofInstance.short_id}`;

    const ret: RecordData[] = [
      {
        label: i18n.set_id,
        value: proofInstance.proof_instance_id,
      },
      {
        label: i18n.proof_type_id,
        value: proofInstance.proof_type_id,
      },
      {
        label: i18n.proof_label,
        value: proofInstance.proof_label,
      },
      {
        label: i18n.share_url,
        value: (
          <div className={cn(styles.cell, styles.url)}>
            <span>{url}</span>
            <Popover createBase={createCopyButton} createPopover={createCopyButtonTooltip} />
          </div>
        ),
      },
      {
        label: i18n.verified,
        value: (
          <div className={cn(styles.cell, styles.verified)}>
            <AiFillCheckCircle />
            <span>{i18n.verified}</span>
          </div>
        ),
      },
      {
        label: i18n.created_at,
        value: proofInstance.created_at,
      },
      {
        label: i18n.proof_type_description,
        value: proofInstance.proof_desc,
      },
      {
        label: i18n.proof_type_id,
        value: proofInstance.proof_type_id,
      },
      {
        label: i18n.circuit_driver_id,
        value: proofInstance.circuit_driver_id,
      },
      {
        label: i18n.circuit_id,
        value: proofInstance.circuit_id,
      },
    ];

    return ret;
  }, [proofInstance]);

  // const rowsElem = React.useMemo(() => {
  //   let { record } = data;

  //   let rows: React.ReactNode[] = [];
  //   if (record === undefined || Object.keys(record).length < 1) {
  //     return rows;
  //   }

  //   const createdAt = dayjs(record.created_at).format("YYYY-MM-DD");
  //   // const url = `${process.env.NEXT_PUBLIC_PRFS_WEB_ENDPOINT}/p/${record.short_id}`;

  //   return (
  //     <TableBody>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.proof_instance_id}</td>
  //         <td className={styles.value}>{record.proof_instance_id}</td>
  //         <td></td>
  //       </TableRow>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.proof_type_id}</td>
  //         <td className={styles.value}>{record.proof_type_id}</td>
  //       </TableRow>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.proof_label}</td>
  //         <td className={styles.value}>{record.proof_label}</td>
  //       </TableRow>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.share_url}</td>
  //         <td className={cn(styles.value, styles.url)}>
  //           <div className={styles.cell}>
  //             <span>{url}</span>
  //             <Popover createBase={createCopyButton} createPopover={createCopyButtonTooltip} />
  //           </div>
  //         </td>
  //       </TableRow>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.verified}</td>
  //         <td className={cn(styles.value, styles.verified)}>
  //           <div className={styles.cell}>
  //             <AiFillCheckCircle />
  //             <span>{i18n.verified}</span>
  //           </div>
  //         </td>
  //       </TableRow>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.created_at}</td>
  //         <td className={styles.value}>{createdAt}</td>
  //       </TableRow>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.proof_type_description}</td>
  //         <td className={styles.value}>{record.proof_desc}</td>
  //       </TableRow>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.proof_type_id}</td>
  //         <td className={styles.value}>{record.proof_label}</td>
  //       </TableRow>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.circuit_driver_id}</td>
  //         <td className={styles.value}>{record.circuit_driver_id}</td>
  //       </TableRow>
  //       <TableRow>
  //         <td className={styles.label}>{i18n.circuit_id}</td>
  //         <td className={styles.value}>{record.circuit_id}</td>
  //       </TableRow>
  //     </TableBody>
  //   );
  // }, [data, url]);

  // return <Table>{rowsElem}</Table>;
  //
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    proofInstance && (
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

export default ProofInstanceDetailTable;

export interface ProofInstanceDetailTableProps {
  proofInstance: PrfsProofInstanceSyn1;
}
