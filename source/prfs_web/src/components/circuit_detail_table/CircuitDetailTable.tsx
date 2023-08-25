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
import Table2 from "@/components/table2/Table2";

type RecordData = {
  label: string;
  value: any;
};

const defaultData: RecordData[] = [
  {
    label: "tanner",
    value: "linsley",
  },
  {
    label: "tandy",
    value: "miller",
  },
];

const columnHelper = createColumnHelper<RecordData>();

const columns = [
  columnHelper.accessor("label", {
    cell: info => info.getValue(),
  }),
  columnHelper.accessor(row => row.value, {
    id: "lastName",
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
  }),
];

const CircuitDetailTable: React.FC<CircuitDetailTableProps> = ({ circuit }) => {
  const i18n = React.useContext(i18nContext);

  return circuit && <Table2 data={defaultData} columns={columns} />;
};

export default CircuitDetailTable;

interface CircuitDetailTableProps {
  circuit: PrfsCircuit | undefined;
}
