"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useSearchParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtual } from "react-virtual";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { GetPrfsProofInstancesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstancesResponse";

import styles from "./ProofsPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import ContentArea from "@/components/content_area/ContentArea";

const fetchSize = 25;

const ProofsPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const columns = React.useMemo<ColumnDef<PrfsProofInstanceSyn1>[]>(
    () => [
      {
        accessorFn: row => row.proof_instance_id,
        header: "Proof instance id",
      },
      {
        accessorFn: row => row.proof_label,
        header: "Label",
      },
      // {
      //   accessorFn: row => row.lastName,
      //   id: "lastName",
      //   cell: info => info.getValue(),
      //   header: () => <span>Last Name</span>,
      // },
      // {
      //   accessorKey: "age",
      //   header: () => "Age",
      //   size: 50,
      // },
      // {
      //   accessorKey: "visits",
      //   header: () => <span>Visits</span>,
      //   size: 50,
      // },
      // {
      //   accessorKey: "status",
      //   header: "Status",
      // },
      // {
      //   accessorKey: "progress",
      //   header: "Profile Progress",
      //   size: 80,
      // },
      {
        accessorFn: row => row.created_at,
        header: "Created At",
        cell: info => info.getValue(),
      },
    ],
    []
  );

  const { data, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery<GetPrfsProofInstancesResponse>(
      ["table-data"],
      async ({ pageParam = 0 }) => {
        const start = pageParam * fetchSize;

        const { payload } = await prfsApi2("get_prfs_proof_instances", {
          page_idx: start,
          page_size: fetchSize,
        });
        return payload;
      },
      {
        getNextPageParam: (_lastGroup, groups) => groups.length,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    );

  // we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap(page => page.prfs_proof_instances_syn1) ?? [],
    [data]
  );
  const totalDBRowCount = data?.pages?.[0]?.table_row_count ?? 0;
  const totalFetched = flatData.length;

  // called on scroll and possibly on mount to fetch more data
  // as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // once the user has scrolled within 300px of the bottom of the table,
        // fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  // a check on mount and after a fetch to see if the table is already
  // scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <DefaultLayout>
      <Masthead />
      <ContentArea>
        <div className={styles.wrapper}>
          <div
            className={styles.feedContainer}
            onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
            ref={tableContainerRef}
          >
            <div>
              {paddingTop > 0 && (
                <div>
                  <div style={{ height: `${paddingTop}px` }} />
                </div>
              )}
              {virtualRows.map(virtualRow => {
                const row = rows[virtualRow.index] as Row<PrfsProofInstanceSyn1>;
                return (
                  <div key={row.id} className={styles.row}>
                    {row.getVisibleCells().map(cell => {
                      return (
                        <div key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              {paddingBottom > 0 && (
                <div>
                  <div style={{ height: `${paddingBottom}px` }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default ProofsPage;
