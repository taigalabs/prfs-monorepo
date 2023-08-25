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
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";

const columnHelper = createColumnHelper<RecordData>();

const DriverDetailTable: React.FC<DriverDetailTableProps> = ({ driver }) => {
  const i18n = React.useContext(i18nContext);

  const data = React.useMemo(() => {
    if (!driver) {
      return [];
    }

    const ret: RecordData[] = [
      {
        label: i18n.circuit_driver_id,
        value: driver.circuit_driver_id,
      },
      {
        label: i18n.driver_repository_url,
        value: driver.driver_repository_url,
      },
      {
        label: i18n.version,
        value: driver.version,
      },
      {
        label: i18n.author,
        value: driver.author,
      },
      {
        label: i18n.description,
        value: driver.desc,
      },
      {
        label: i18n.created_at,
        value: driver.created_at,
      },
    ];

    return ret;
  }, [driver]);

  const columns = [
    columnHelper.accessor("label", {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor(row => row.value, {
      id: "value",
      cell: info => <i>{info.getValue()}</i>,
    }),
  ];

  return driver && <Table2 data={data} columns={columns} headless />;
};

export default DriverDetailTable;

interface DriverDetailTableProps {
  driver: PrfsCircuitDriver | undefined;
}
