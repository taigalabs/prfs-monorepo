import React from "react";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
// import { useVirtual } from "react-virtual";
import { GetPrfsPollsResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsPollsResponse";
import dayjs from "dayjs";

import styles from "./PollFeeds.module.scss";
import { i18nContext } from "@/contexts/i18n";
import RowItem from "./RowItem";
import { paths } from "@/paths";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";

const fetchSize = 15;

const PollFeeds: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const columns = React.useMemo<ColumnDef<PrfsPoll>[]>(
    () => [
      {
        accessorFn: row => row.label,
        header: "Label",
      },
      {
        accessorFn: row => row.created_at,
        header: "Created At",
        cell: info => {
          const val = info.getValue() as string;
          const day = dayjs(val);
          return day.format("YYYY-MM-DD");
        },
      },
      {
        accessorFn: row => row.description,
        header: "Description",
      },
      {
        accessorFn: row => row.poll_id,
        header: "Poll Id",
      },
    ],
    [],
  );

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["get_prfs_polls"],
    queryFn: async ({ pageParam }) => {
      return await prfsApi2("get_prfs_polls", {
        page_idx: pageParam as any,
        page_size: fetchSize,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
  });

  // we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap(page => (page.payload ? page.payload.prfs_polls : [])) ?? [],
    [data],
  );
  const totalDBRowCount = data?.pages?.[0]?.payload?.table_row_count ?? 0;
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
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
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
  });

  const { rows } = table.getRowModel();

  // const rowVirtualizer = useVirtual({
  //   parentRef: tableContainerRef,
  //   size: rows.length,
  //   overscan: 10,
  // });
  // const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  // const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  // const paddingBottom =
  //   virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  // return (
  //   <div className={styles.wrapper}>
  //     {/* <div className={styles.borderBox} /> */}
  //     <div
  //       className={styles.feedContainer}
  //       onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
  //       ref={tableContainerRef}
  //     >
  //       <div className={styles.topPlaceholder} />
  //       {isLoading ? (
  //         <>Loading...</>
  //       ) : (
  //         <div>
  //           {paddingTop > 0 && (
  //             <div>
  //               <div style={{ height: `${paddingTop}px` }} />
  //             </div>
  //           )}
  //           {virtualRows.map(virtualRow => {
  //             const row = rows[virtualRow.index] as Row<PrfsPoll>;

  //             return <RowItem key={row.id} row={row} />;
  //           })}
  //           {paddingBottom > 0 && (
  //             <div>
  //               <div style={{ height: `${paddingBottom}px` }} />
  //             </div>
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  //
  return null;
};

export default PollFeeds;
