"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { TableSearch } from "@taigalabs/prfs-react-components/src/table/Table";
import dayjs from "dayjs";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./ProofTypeTable.module.scss";
import Table2, { Table2Body, Table2Head, Table2Pagination } from "@/components/table2/Table2";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const ProofTypeTable: React.FC<ProofTypeTableProps> = () => {
  const i18n = React.useContext(i18nContext);
  // const [data, setData] = React.useState<TableData<PrfsProofType>>({ page: 0, values: [] });
  const [data, setData] = React.useState<PrfsProofType[]>([]);

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsProofType>[] = [
      {
        id: "proof_instance_id",
        header: i18n.proof_type_id,
        accessorFn: row => row.proof_type_id,
        cell: info => info.getValue(),
      },
    ];

    return cols;
  }, [i18n]);

  // const handleChangePage = React.useCallback(async (page: number) => {
  //   return prfsApi
  //     .getPrfsProofTypes({
  //       page,
  //     })
  //     .then(resp => {
  //       const { page, prfs_proof_types } = resp.payload;
  //       return {
  //         page,
  //         values: prfs_proof_types,
  //       };
  //     });
  // }, []);

  // React.useEffect(() => {
  //   Promise.resolve(handleChangePage(0)).then(res => {
  //     setData(res);
  //   });
  // }, [setData, handleChangePage]);

  // const rowsElem = React.useMemo(() => {
  //   // console.log(1, data);

  //   let { page, values } = data;

  //   let rows: React.ReactNode[] = [];
  //   if (values === undefined || values.length < 1) {
  //     return rows;
  //   }

  //   for (let val of values) {
  //     const createdAt = dayjs(val.created_at).format("YYYY-MM-DD");

  //     let row = (
  //       <TableRow key={val.proof_type_id}>
  //         <td className={styles.proofTypeId}>
  //           <Link href={`${paths.proof__proof_types}/${val.proof_type_id}`}>
  //             {val.proof_type_id}
  //           </Link>
  //         </td>
  //         <td className={styles.label}>{val.label}</td>
  //         <td className={styles.desc}>{val.desc}</td>
  //         <td className={styles.circuitId}>{val.circuit_id}</td>
  //         <td className={styles.createdAt}>{createdAt}</td>
  //       </TableRow>
  //     );

  //     rows.push(row);
  //   }

  //   return rows;
  // }, [data]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi.getPrfsProofTypes({
        page_idx: pageIndex,
        page_size: pageSize,
      });

      setData(payload.prfs_proof_types);
    }

    fn().then();
  }, [setData, pageIndex, pageSize]);

  const pagination = React.useMemo(() => {
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className={styles.wrapper}>
      <TableSearch>
        <input placeholder={i18n.proof_instance_search_guide} />
      </TableSearch>
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

      <Table2Pagination table={table} />
    </div>
  );

  // return (
  //   <div className={styles.wrapper}>
  //     <TableSearch>
  //       <input placeholder={i18n.proof_type_search_guide} />
  //     </TableSearch>
  //     <Table>
  //       <TableHeader>
  //         <TableRow>
  //           <th className={styles.proofTypeId}>{i18n.proof_type_id}</th>
  //           <th className={styles.label}>{i18n.label}</th>
  //           <th className={styles.desc}>{i18n.description}</th>
  //           <th className={styles.circuitId}>{i18n.circuit_id}</th>
  //           <th className={styles.createdAt}>{i18n.created_at}</th>
  //           <th></th>
  //         </TableRow>
  //       </TableHeader>
  //       <TableBody>{rowsElem}</TableBody>
  //     </Table>
  //   </div>
  // );
};

export default ProofTypeTable;

export interface ProofTypeTableProps {}
