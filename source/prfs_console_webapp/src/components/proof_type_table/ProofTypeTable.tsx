import React from "react";
import Link from "next/link";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
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
import Table2, {
  Table2Body,
  Table2Head,
  Table2Pagination,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table2/Table2";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";

import styles from "./ProofTypeTable.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const ProofTypeTable: React.FC<ProofTypeTableProps> = () => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<PrfsProofType[]>([]);
  const router = useRouter();

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsProofType>[] = [
      {
        id: "img_url",
        accessorFn: row => row.img_url,
        cell: info => {
          const img_url = info.getValue() as string;

          return (
            <div className={styles.imgCol}>
              <CaptionedImg img_url={img_url} size={50} />
            </div>
          );
        },
      },
      {
        id: "proof_type_id",
        header: i18n.proof_type_id,
        accessorFn: row => row.proof_type_id,
        cell: info => info.getValue(),
      },
      {
        id: "label",
        accessorFn: row => row.label,
        cell: info => info.getValue(),
      },
      {
        id: "desc",
        accessorFn: row => row.desc,
        cell: info => info.getValue(),
      },
      {
        id: "circuit_id",
        accessorFn: row => row.circuit_id,
        cell: info => info.getValue(),
      },
      {
        id: "created_at",
        accessorFn: row => row.created_at,
        cell: info => {
          return dayjs(info.getValue() as string).format("YYYY-MM-DD");
        },
      },
    ];

    return cols;
  }, [i18n]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi2("get_prfs_proof_types", {
        page_idx: pageIndex,
        page_size: pageSize,
      });

      if (payload) {
        setData(payload.prfs_proof_types);
      }
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
        <input placeholder={i18n.proof_type_search_guide} />
      </TableSearch>
      <Table2>
        <Table2Head>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </Table2Head>

        <Table2Body>
          {table.getRowModel().rows.map(row => {
            const proofTypeId = row.getValue("proof_type_id") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  router.push(`${paths.proof_types}/${proofTypeId}`);
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

      {/* <Table2Pagination table={table} /> */}
    </div>
  );
};

export default ProofTypeTable;

export interface ProofTypeTableProps {}
