"use client";

import React from "react";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./ProofTypeDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import Table2, { RecordData } from "../table2/Table2";

const columnHelper = createColumnHelper<RecordData>();

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

  const columns = [
    columnHelper.accessor("label", {
      cell: info => <div className={styles.label}>{info.getValue()}</div>,
    }),
    columnHelper.accessor(row => row.value, {
      id: "value",
      cell: info => info.getValue(),
    }),
  ];

  return proofType && <Table2 data={data} columns={columns} headless />;
};

export default ProofTypeDetailTable;

export interface ProofTypeDetailTableProps {
  proofType: PrfsProofType | undefined;
}
