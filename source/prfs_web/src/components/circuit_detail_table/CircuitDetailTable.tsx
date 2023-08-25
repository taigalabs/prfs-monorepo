import React from "react";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./CircuitDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Table2, { RecordData } from "@/components/table2/Table2";

const columnHelper = createColumnHelper<RecordData>();

const CircuitDetailTable: React.FC<CircuitDetailTableProps> = ({ circuit }) => {
  const i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    if (!circuit) {
      return [];
    }

    const ret: RecordData[] = [
      {
        label: i18n.circuit_id,
        value: circuit.circuit_id,
      },
      {
        label: i18n.label,
        value: circuit.label,
      },
      {
        label: i18n.circuit_id,
        value: circuit.circuit_id,
      },
      {
        label: i18n.description,
        value: circuit.desc,
      },
      {
        label: i18n.finite_field,
        value: circuit.finite_field,
      },
      {
        label: i18n.proof_algorithm,
        value: circuit.proof_algorithm,
      },
      {
        label: i18n.elliptic_curve,
        value: circuit.elliptic_curve,
      },
      {
        label: i18n.circuit_dsl,
        value: circuit.circuit_dsl,
      },
      {
        label: i18n.arithmetization,
        value: circuit.arithmetization,
      },
      {
        label: i18n.circuit_driver_id,
        value: circuit.circuit_driver_id,
      },
      {
        label: i18n.driver_version,
        value: circuit.driver_version,
      },
      {
        label: i18n.num_public_inputs,
        value: circuit.num_public_inputs,
      },
      {
        label: i18n.author,
        value: circuit.author,
      },
      {
        label: i18n.created_at,
        value: circuit.created_at,
      },
    ];

    return ret;
  }, [circuit]);

  const columns = [
    columnHelper.accessor("label", {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor(row => row.value, {
      id: "value",
      cell: info => <i>{info.getValue()}</i>,
    }),
  ];

  return circuit && <Table2 data={data} columns={columns} headless />;
};

export default CircuitDetailTable;

interface CircuitDetailTableProps {
  circuit: PrfsCircuit | undefined;
}
