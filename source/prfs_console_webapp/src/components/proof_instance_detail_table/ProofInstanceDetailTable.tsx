import React from "react";
import cn from "classnames";
import { AiFillCheckCircle } from "@react-icons/all-files/ai/AiFillCheckCircle";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table2, { RecordData, Table2Body } from "@taigalabs/prfs-react-lib/src/table2/Table2";
import Link from "next/link";

import styles from "./ProofInstanceDetailTable.module.scss";
import { i18nContext } from "@/i18n/context";
import Popover from "@taigalabs/prfs-react-lib/src/popover/Popover";
import { envs } from "@/envs";
import { paths } from "@/paths";

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

  const shortURL = React.useMemo(() => {
    return `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}/p/${proofInstance.short_id}`;
  }, [proofInstance]);

  const handleClickCopy = React.useCallback(() => {
    navigator.clipboard.writeText(shortURL);
  }, [shortURL]);

  const createCopyButton = React.useCallback((_: boolean) => {
    return (
      <button onClick={handleClickCopy}>
        <AiOutlineCopy />
      </button>
    );
  }, []);

  const createCopyButtonTooltip = React.useCallback(
    (_: React.Dispatch<React.SetStateAction<any>>) => {
      return <div className={styles.copyBtnTooltip}>{i18n.url_is_copied}</div>;
    },
    [],
  );

  const data = React.useMemo(() => {
    if (!proofInstance) {
      return [];
    }

    // const url = `${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/p/${proofInstance.short_id}`;

    const ret: RecordData[] = [
      {
        label: i18n.proof_instance_id,
        value: proofInstance.proof_instance_id,
      },
      {
        label: i18n.proof_label,
        value: proofInstance.proof_type_label,
      },
      {
        label: i18n.share_url,
        value: (
          <div className={cn(styles.cell, styles.url)}>
            <span>{shortURL}</span>
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
        label: i18n.prfs_ack_sig,
        value: proofInstance.prfs_ack_sig,
      },
      {
        label: i18n.proof_type_description,
        value: proofInstance.proof_type_desc,
      },
      {
        label: i18n.proof_type_id,
        value: (
          <div>
            <Link href={`${paths.proof_types}/${proofInstance.proof_type_id}`}>
              {proofInstance.proof_type_id}
            </Link>
          </div>
        ),
      },
      {
        label: i18n.circuit_driver_id,
        value: (
          <div>
            <Link href={`${paths.circuit_drivers}/${proofInstance.circuit_driver_id}`}>
              {proofInstance.circuit_driver_id}
            </Link>
          </div>
        ),
      },
      {
        label: i18n.circuit_id,
        value: (
          <div>
            <Link href={`${paths.circuits}/${proofInstance.circuit_id}`}>
              {proofInstance.circuit_id}
            </Link>
          </div>
        ),
      },
    ];

    return ret;
  }, [proofInstance]);

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
