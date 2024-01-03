import React from "react";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table2, { RecordData, Table2Body } from "@taigalabs/prfs-react-lib/src/table2/Table2";

import styles from "./ProofTypeDetailTable.module.scss";
import { i18nContext } from "@/i18n/context";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

const columnHelper = createColumnHelper<RecordData>();

const columns = [
  columnHelper.accessor("label", {
    cell: info => <div className={styles.label}>{info.getValue()}</div>,
  }),
  columnHelper.accessor(row => row.value, {
    id: "value",
    cell: info => info.getValue(),
  }),
];

const ProofTypeDetailTable: React.FC<ProofTypeDetailTableProps> = ({ proofType }) => {
  const i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    if (!proofType) {
      return [];
    }

    const ret: RecordData[] = [
      {
        label: i18n.proof_type_id,
        value: proofType.proof_type_id,
      },
      {
        label: i18n.label,
        value: proofType.label,
      },
      {
        label: i18n.description,
        value: proofType.desc,
      },
      {
        label: i18n.circuit_id,
        value: proofType.circuit_id,
      },
      {
        label: i18n.author,
        value: proofType.author,
      },
      {
        label: i18n.created_at,
        value: proofType.created_at,
      },
    ];

    return ret;
  }, [proofType]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    proofType && (
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

export default ProofTypeDetailTable;

export interface ProofTypeDetailTableProps {
  proofType: PrfsProofType | undefined;
}
