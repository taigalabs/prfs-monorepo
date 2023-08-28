import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableData,
} from "@taigalabs/prfs-react-components/src/table/Table";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./CircuitInputsMetaTable.module.scss";
import Table2, { RecordData, Table2Body, Table2Head } from "@/components/table2/Table2";
import { i18nContext } from "@/contexts/i18n";

const CircuitInputsMetaTable: React.FC<CircuitInputsMetaTableProps> = ({
  circuit_inputs_meta,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);

  // const [data, setData] = React.useState<TableData<CircuitInputMeta>>({
  //   page: 0,
  //   values: circuit_inputs_meta,
  // });

  // const rowsElem = React.useMemo(() => {
  //   let { values } = data;

  //   let rows: React.ReactNode[] = [];
  //   if (values.length < 1) {
  //     return rows;
  //   }

  //   for (const val of values) {
  //     let row = (
  //       <TableRow key={val.label}>
  //         <td className={styles.label}>{val.label}</td>
  //         <td className={styles.desc}>{val.desc}</td>
  //         <td className={styles.type}>{val.type}</td>
  //         <td className={styles.ref}>{val.ref}</td>
  //       </TableRow>
  //     );

  //     rows.push(row);
  //   }

  //   return rows;
  // }, [data]);

  // return (
  //   <Table>
  //     <TableHeader>
  //       <TableRow>
  //         <th className={styles.label}>{i18n.label}</th>
  //         <th className={styles.desc}>{i18n.description}</th>
  //         <th className={styles.type}>{i18n.type}</th>
  //         <th className={styles.ref}>{i18n.reference}</th>
  //       </TableRow>
  //     </TableHeader>
  //     <TableBody>{rowsElem}</TableBody>
  //   </Table>
  // );
  //
  const columns = React.useMemo(() => {
    const cols: ColumnDef<CircuitInputMeta>[] = [
      {
        header: i18n.type,
        accessorFn: row => row.type,
        cell: info => info.getValue(),
      },
      {
        header: i18n.label,
        accessorFn: row => row.label,
        cell: info => info.getValue(),
      },
      {
        header: i18n.description,
        accessorFn: row => row.desc,
        cell: info => info.getValue(),
      },
      {
        header: i18n.reference,
        accessorFn: row => row.ref,
        cell: info => info.getValue(),
      },
    ];

    return cols;
  }, [i18n]);

  const [data, setData] = React.useState<CircuitInputMeta[]>(circuit_inputs_meta);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.wrapper}>
      <Table2>
        <Table2Head>
          <tr>
            <th className={styles.imgCol} />
            <th>{i18n.proof_instance_id}</th>
            <th>{i18n.proof_type}</th>
            <th>{i18n.expression}</th>
            <th>{i18n.prioritized_public_input}</th>
            <th>{i18n.created_at}</th>
          </tr>
        </Table2Head>

        <Table2Body>
          {table.getRowModel().rows.map(row => {
            // const proofInstanceId = row.getValue("proof_instance_id") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  // router.push(`${paths.proof__proof_instances}/${proofInstanceId}`);
                }}
              >
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

export default CircuitInputsMetaTable;

export interface CircuitInputsMetaTableProps {
  circuit_inputs_meta: CircuitInputMeta[];
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
