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
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
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
import { useQuery } from "@tanstack/react-query";

import styles from "./ProofInstanceTable.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const ProofInstanceTable: React.FC<ProofInstanceTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const [priorityCol, setPriorityCol] = React.useState<string>();
  const router = useRouter();

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsProofInstanceSyn1>[] = [
      {
        id: i18n.image_url,
        accessorFn: row => row.img_url,
        header: "Image",
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
        id: "proof_instance_id",
        header: i18n.proof_instance_id,
        accessorFn: row => row.proof_instance_id,
        cell: info => info.getValue(),
      },
      {
        header: i18n.proof_type,
        accessorFn: row => row.proof_type_label,
        cell: info => info.getValue(),
      },
      {
        header: i18n.expression,
        accessorFn: row => row.expression,
        cell: info => info.getValue(),
      },
      {
        header: i18n.prioritized_public_input,
        accessorFn: row => row.public_inputs,
        cell: info => {
          if (priorityCol) {
            const obj = info.getValue() as Record<string, any>;
            return obj[priorityCol];
          } else {
            return "No priority col";
          }
        },
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

  const [data, setData] = React.useState<PrfsProofInstanceSyn1[]>([]);

  React.useEffect(() => {
    if (data.length > 0) {
      for (const input of data[0].public_inputs_meta as PublicInputMeta[]) {
        if (input.show_priority === 0) {
          setPriorityCol(input.name);
          break;
        }
      }
    }
  }, [data, setPriorityCol]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi2("get_prfs_proof_instances", {
        page_idx: pageIndex,
        page_size: pageSize,
      });

      if (payload) {
        setData(payload.prfs_proof_instances_syn1);
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

export default ProofInstanceTable;

export interface ProofInstanceTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsProofInstanceSyn1;
  handleSelectVal?: (row: PrfsProofInstanceSyn1) => void;
}
