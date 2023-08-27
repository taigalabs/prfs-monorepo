"use client";

import React from "react";
import Link from "next/link";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import Table, {
  TableBody,
  TableHeader,
  TableRecordData,
  TableData,
  TableRow,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table/Table";
import dayjs from "dayjs";

import styles from "./ProofInstanceTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Table2, { Table2Body, Table2Head, Table2Pagination } from "../table2/Table2";

const ProofInstanceTable: React.FC<ProofInstanceTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);

  const columns: ColumnDef<PrfsProofInstanceSyn1>[] = [
    {
      header: "Position",
      accessorFn: row => row.proof_label,
      cell: info => info.getValue(),
    },
    // {
    //   header: "Value",
    //   accessorFn: row => row.val,
    // },
  ];

  const [data, setData] = React.useState<PrfsProofInstanceSyn1[]>([]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      console.log(33);
      const { payload } = await prfsApi.getPrfsProofInstances({
        page_idx: pageIndex,
        page_size: pageSize,
      });

      const { prfs_proof_instances_syn1 } = payload;

      setData(prfs_proof_instances_syn1);
    }

    fn().then();
  }, [setData, pageIndex, pageSize]);

  console.log(22, data);

  const pagination = React.useMemo(() => {
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    meta: { a: 1 },
    data,
    columns,
    // pageCount: prfsSet ? Number(prfsSet.cardinality) : -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className={styles.wrapper}>
      <Table2>
        <Table2Head>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </Table2Head>

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

      <Table2Pagination table={table} />
    </div>
  );

  ////////////
  //
  //

  // const [data, setData] = React.useState<TableData<PrfsProofInstanceSyn1>>({ page: 0, values: [] });

  // const handleChangeProofPage = React.useCallback(async (page: number) => {
  //   return prfsApi
  //     .getPrfsProofInstances({
  //       page,
  //       limit: 20,
  //     })
  //     .then(resp => {
  //       const { page, prfs_proof_instances_syn1 } = resp.payload;
  //       return {
  //         page,
  //         values: prfs_proof_instances_syn1,
  //       };
  //     });
  // }, []);

  // React.useEffect(() => {
  //   handleChangeProofPage(0).then(res => {
  //     setData(res);
  //   });
  // }, [handleChangeProofPage, setData]);

  // const rowsElem = React.useMemo(() => {
  //   let { page, values } = data;

  //   let rows: React.ReactNode[] = [];
  //   if (values === undefined || values.length < 1) {
  //     return rows;
  //   }

  //   for (let val of values) {
  //     const onClickRow = handleSelectVal
  //       ? (_ev: React.MouseEvent) => {
  //           handleSelectVal(val);
  //         }
  //       : undefined;

  //     const isSelected = selectedVal && selectedVal.proof_instance_id == val.proof_instance_id;
  //     const selType = selectType || "radio";

  //     const shortPublicInputs = JSON.stringify(val.public_inputs).substring(0, 40);

  //     const createdAt = dayjs(val.created_at).format("YYYY-MM-DD");

  //     let row = (
  //       <TableRow key={val.proof_instance_id} onClickRow={onClickRow} isSelected={isSelected}>
  //         {selectedVal && (
  //           <td className={styles.radio}>
  //             <input type={selType} checked={isSelected} readOnly />
  //           </td>
  //         )}
  //         <td className={styles.proof_instance_id}>
  //           <Link href={`${paths.proof__proof_instances}/${val.proof_instance_id}`}>
  //             {val.proof_instance_id}
  //           </Link>
  //         </td>
  //         <td className={styles.proof_type_id}>{val.proof_type_id}</td>
  //         <td className={styles.public_inputs}>{shortPublicInputs}</td>
  //         <td className={styles.createdAt}>{createdAt}</td>
  //       </TableRow>
  //     );

  //     rows.push(row);
  //   }

  //   return rows;
  // }, [data]);

  // return (
  //   <div>
  //     <TableSearch>
  //       <input placeholder={i18n.proof_instance_search_guide} />
  //     </TableSearch>
  //     <Table>
  //       <TableHeader>
  //         <TableRow>
  //           {handleSelectVal && <th className={styles.radio}></th>}
  //           <th className={styles.proof_instance_id}>{i18n.id}</th>
  //           <th className={styles.proof_type_id}>{i18n.proof_type_id}</th>
  //           <th className={styles.public_inputs}>{i18n.public_inputs}</th>
  //           <th className={styles.createdAt}>{i18n.created_at}</th>
  //           <th></th>
  //         </TableRow>
  //       </TableHeader>
  //       <TableBody>{rowsElem}</TableBody>
  //     </Table>
  //   </div>
  // );
};

export default ProofInstanceTable;

export interface ProofInstanceTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsProofInstanceSyn1;
  handleSelectVal?: (row: PrfsProofInstanceSyn1) => void;
}
