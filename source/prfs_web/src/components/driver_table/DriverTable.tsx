"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";
// import Table, {
//   TableBody,
//   TableHeader,
//   TableData,
//   TableRecordData,
//   TableRow,
//   TableSearch,
// } from "@taigalabs/prfs-react-components/src/table/Table";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import styles from "./DriverTable.module.scss";
import Table2, {
  Table2Body,
  Table2Head,
  Table2Pagination,
  TableSearch,
} from "@/components/table2/Table2";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const DriverTable: React.FC<DriverTableProps> = ({ selectType, selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  // const [data, setData] = React.useState<TableData<PrfsCircuitDriver>>({ page: 0, values: [] });

  // const handleChangeProofPage = React.useCallback(async (page: number) => {
  //   return prfsApi
  //     .getPrfsNativeCircuitDrivers({
  //       page,
  //     })
  //     .then(resp => {
  //       const { page, prfs_circuit_drivers } = resp.payload;
  //       return {
  //         page,
  //         values: prfs_circuit_drivers,
  //       };
  //     });
  // }, []);

  // React.useEffect(() => {
  //   Promise.resolve(handleChangeProofPage(0)).then(res => {
  //     setData(res);
  //   });
  // }, [setData, handleChangeProofPage]);

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

  //     const isSelected = selectedVal && selectedVal.circuit_driver_id == val.circuit_driver_id;
  //     const selType = selectType || "radio";

  //     let row = (
  //       <TableRow key={val.circuit_driver_id} onClickRow={onClickRow} isSelected={isSelected}>
  //         {selectedVal && (
  //           <td className={styles.radio}>
  //             <input type={selType} checked={isSelected} readOnly />
  //           </td>
  //         )}
  //         <td className={styles.driver_id}>
  //           <Link href={`${paths.proof__circuit_drivers}/${val.circuit_driver_id}`}>
  //             {val.circuit_driver_id}
  //           </Link>
  //         </td>
  //         <td className={styles.repoUrl}>{val.driver_repository_url}</td>
  //         <td className={styles.version}>{val.version}</td>
  //       </TableRow>
  //     );

  //     rows.push(row);
  //   }

  //   return rows;
  // }, [data]);

  // return (
  //   <div>
  //     <TableSearch>
  //       <input placeholder={i18n.driver_search_guide} />
  //     </TableSearch>
  //     <Table>
  //       <TableHeader>
  //         <TableRow>
  //           {handleSelectVal && <th className={styles.radio}></th>}
  //           <th className={styles.driver_id}>{i18n.circuit_driver_id}</th>
  //           <th className={styles.driver_repository_url}>{i18n.driver_repository_url}</th>
  //           <th className={styles.version}>{i18n.version}</th>
  //         </TableRow>
  //       </TableHeader>
  //       <TableBody>{rowsElem}</TableBody>
  //     </Table>
  //   </div>
  // );

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsCircuitDriver>[] = [
      {
        id: "circuit_driver_id",
        header: i18n.circuit_driver_id,
        accessorFn: row => row.circuit_driver_id,
        cell: info => info.getValue(),
      },
      {
        header: i18n.driver_repository_url,
        accessorFn: row => row.driver_repository_url,
        cell: info => info.getValue(),
      },
      {
        header: i18n.version,
        accessorFn: row => row.version,
        cell: info => info.getValue(),
      },
    ];

    return cols;
  }, [i18n]);

  const [data, setData] = React.useState<PrfsCircuitDriver[]>([]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi.getPrfsCircuitDrivers({
        page_idx: pageIndex,
        page_size: pageSize,
      });

      const { prfs_circuit_drivers } = payload;

      setData(prfs_circuit_drivers);
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
        <input placeholder={i18n.proof} />
      </TableSearch>
      <Table2>
        <Table2Head>
          <tr>
            <th className={styles.driver_id}>{i18n.circuit_driver_id}</th>
            <th className={styles.driver_repository_url}>{i18n.driver_repository_url}</th>
            <th className={styles.version}>{i18n.version}</th>
          </tr>
        </Table2Head>

        <Table2Body>
          {table.getRowModel().rows.map(row => {
            const circuit_driver_id = row.getValue("circuit_driver_id") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  router.push(`${paths.proof__circuit_drivers}/${circuit_driver_id}`);
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
};

export default DriverTable;

export interface DriverTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuitDriver;
  handleSelectVal?: (row: PrfsCircuitDriver) => void;
}
