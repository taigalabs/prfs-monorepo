import React from "react";
import Link from "next/link";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import Table2, {
  Table2Body,
  Table2Head,
  Table2Pagination,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table2/Table2";

import styles from "./SetTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { PrfsSetType } from "@taigalabs/prfs-entities/bindings/PrfsSetType";

const SetTable: React.FC<SetTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
  setType,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<PrfsSet[]>([]);
  const router = useRouter();

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsSet>[] = [
      {
        id: "set_id",
        header: i18n.set_id,
        accessorFn: row => row.set_id,
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
        id: "cardinality",
        accessorFn: row => row.cardinality,
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
      const { payload } = await prfsApi2("get_prfs_sets_by_set_type", {
        page_idx: pageIndex,
        page_size: 20,
        set_type: setType,
      });

      setData(payload.prfs_sets);
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
        <input placeholder={i18n.set_search_guide} />
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
            const setId = row.getValue("set_id") as string;

            return (
              <tr
                key={row.id}
                onClick={() => {
                  switch (setType) {
                    case "Dynamic": {
                      router.push(`${paths.dynamic_sets}/${setId}`);
                      break;
                    }
                    case "Static": {
                      router.push(`${paths.sets}/${setId}`);
                    }
                  }
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

export default SetTable;

export interface SetTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsSet;
  handleSelectVal?: (row: PrfsSet) => void;
  setType: PrfsSetType;
}
