import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuitType } from "@taigalabs/prfs-entities/bindings/PrfsCircuitType";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableData,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table/Table";
import dayjs from "dayjs";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import styles from "./CircuitTypeTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Table2, { Table2Body, Table2Head, Table2Pagination } from "@/components/table2/Table2";

const CircuitTypeTable: React.FC<CircuitTypeTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  // const [data, setData] = React.useState<TableData<PrfsCircuitType>>({ page: 0, values: [] });

  // const handleChangeProofPage = React.useCallback(async (page: number) => {
  //   try {
  //     const { payload } = await prfsApi.getPrfsCircuitTypes({
  //       page,
  //     });

  //     return {
  //       page: payload.page,
  //       values: payload.prfs_circuit_types,
  //     };
  //   } catch (err) {
  //     throw err;
  //   }
  // }, []);

  // React.useEffect(() => {
  //   async function fn() {
  //     try {
  //       const res = await handleChangeProofPage(0);
  //       setData(res);
  //     } catch (err) {
  //       console.log("error occurred, %o", err);
  //     }
  //   }

  //   fn().then();
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

  //     const isSelected = selectedVal && selectedVal.circuit_type === val.circuit_type;
  //     const selType = selectType || "radio";

  //     const createdAt = dayjs(val.created_at).format("YYYY-MM-DD");

  //     let row = (
  //       <TableRow key={val.circuit_type} onClickRow={onClickRow} isSelected={isSelected}>
  //         {selectedVal && (
  //           <td className={styles.radio}>
  //             <input type={selType} checked={isSelected} readOnly />
  //           </td>
  //         )}
  //         <td className={styles.circuit_type}>
  //           <Link href={`${paths.proof__circuit_types}/${val.circuit_type}`}>
  //             {val.circuit_type}
  //           </Link>
  //         </td>
  //         <td className={styles.desc}>{val.desc}</td>
  //         <td className={styles.author}>{val.author}</td>
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
  //       <input placeholder={i18n.circuit_type_search_guide} />
  //     </TableSearch>
  //     <Table>
  //       <TableHeader>
  //         <TableRow>
  //           {handleSelectVal && <th className={styles.radio}></th>}
  //           <th className={styles.circuit_type}>{i18n.circuit_type}</th>
  //           <th className={styles.desc}>{i18n.description}</th>
  //           <th className={styles.author}>{i18n.author}</th>
  //           <th className={styles.createdAt}>{i18n.created_at}</th>
  //         </TableRow>
  //       </TableHeader>
  //       <TableBody>{rowsElem}</TableBody>
  //     </Table>
  //   </div>
  // );

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsCircuitType>[] = [
      {
        id: "circuit_type",
        header: i18n.circuit_type,
        accessorFn: row => row.circuit_type,
        cell: info => info.getValue(),
      },
      {
        header: i18n.description,
        accessorFn: row => row.desc,
        cell: info => info.getValue(),
      },
      {
        header: i18n.author,
        accessorFn: row => row.author,
        cell: info => info.getValue(),
      },
      {
        header: i18n.created_at,
        accessorFn: row => row.created_at,
        cell: info => {
          const val = info.getValue() as any;
          const createdAt = dayjs(val).format("YYYY-MM-DD");
          return createdAt;
        },
      },
    ];

    return cols;
  }, [i18n]);

  const [data, setData] = React.useState<PrfsCircuitType[]>([]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi.getPrfsCircuitTypes({
        page_idx: pageIndex,
        page_size: pageSize,
      });

      const { prfs_circuit_types } = payload;

      setData(prfs_circuit_types);
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
        <input placeholder={i18n.circuit_type_search_guide} />
      </TableSearch>
      <Table2>
        <Table2Head>
          <tr>
            <th className={styles.circuit_type}>{i18n.circuit_type}</th>
            <th className={styles.desc}>{i18n.description}</th>
            <th className={styles.author}>{i18n.author}</th>
            <th className={styles.createdAt}>{i18n.created_at}</th>
          </tr>
        </Table2Head>

        <Table2Body>
          {table.getRowModel().rows.map(row => {
            const circuitType = row.getValue("circuit_type") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  router.push(`${paths.proof__circuit_types}/${circuitType}`);
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

export default CircuitTypeTable;

export interface CircuitTypeTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuitType;
  handleSelectVal?: (row: PrfsCircuitType) => void;
}
