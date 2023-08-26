import React from "react";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
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
import Table2, { RecordData, Table2Component } from "@/components/table2/Table2";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

const columnHelper = createColumnHelper<RecordData>();

const SetDetailTable: React.FC<SetDetailTableProps> = ({ set }) => {
  const i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    if (!set) {
      return [];
    }

    const ret: RecordData[] = [
      {
        label: i18n.set_id,
        value: set.set_id,
      },
      {
        label: i18n.description,
        value: set.desc,
      },
      {
        label: i18n.label,
        value: set.label,
      },
      {
        label: i18n.cardinality,
        value: set.cardinality,
      },
      {
        label: i18n.element_type,
        value: set.element_type,
      },
      {
        label: i18n.author,
        value: set.author,
      },
      {
        label: i18n.hash_algorithm,
        value: set.hash_algorithm,
      },
      {
        label: i18n.elliptic_curve,
        value: set.elliptic_curve,
      },
      {
        label: i18n.finite_field,
        value: set.finite_field,
      },
      {
        label: i18n.merkle_root,
        value: set.merkle_root,
      },
      {
        label: i18n.created_at,
        value: set.created_at,
      },
    ];

    return ret;
  }, [set]);

  const columns = [
    columnHelper.accessor("label", {
      cell: info => <div className={styles.label}>{info.getValue()}</div>,
    }),
    columnHelper.accessor(row => row.value, {
      id: "value",
      cell: info => info.getValue(),
    }),
  ];

  return set && <Table2Component data={data} columns={columns} headless />;
};

export default SetDetailTable;

interface SetDetailTableProps {
  set: PrfsSet | undefined;
}
