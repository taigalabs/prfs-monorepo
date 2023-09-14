import React from "react";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";
import Table2, {
  Table2Body,
  Table2Head,
  Table2Pagination,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table2/Table2";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";

import styles from "./PollTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { useQuery } from "@tanstack/react-query";

const PollTable: React.FC<PollTableProps> = ({ selectType, selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);
  const [priorityCol, setPriorityCol] = React.useState<string>();
  const router = useRouter();

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsPoll>[] = [
      {
        id: "poll_id",
        header: i18n.poll_id,
        accessorFn: row => row.poll_id,
        cell: info => info.getValue(),
      },
      {
        header: i18n.label,
        accessorFn: row => row.label,
        cell: info => info.getValue(),
      },
      {
        header: i18n.plural_voting,
        accessorFn: row => row.plural_voting,
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
  }, [i18n, priorityCol]);

  const [data, setData] = React.useState<PrfsPoll[]>([]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const query = useQuery({
    queryKey: ["get_prfs_proof_instances"],
    queryFn: async () => {
      const { payload } = await prfsApi2("get_prfs_polls", {
        page_idx: pageIndex,
        page_size: pageSize,
      });
      return payload;
    },
  });

  console.log(123, query);

  // React.useEffect(() => {
  //   async function fn() {
  //     const { payload } = await prfsApi2("get_prfs_proof_instances", {
  //       page_idx: pageIndex,
  //       page_size: pageSize,
  //     });
  //     const { prfs_proof_instances_syn1 } = payload;

  //     setData(prfs_proof_instances_syn1);
  //   }

  //   fn().then();
  // }, [setData, pageIndex, pageSize]);

  const pagination = React.useMemo(() => {
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    meta: {
      priorityCol,
    },
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
            const proofInstanceId = row.getValue("proof_instance_id") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  router.push(`${paths.proof_instances}/${proofInstanceId}`);
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

export default PollTable;

export interface PollTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsPoll;
  handleSelectVal?: (row: PrfsPoll) => void;
}
