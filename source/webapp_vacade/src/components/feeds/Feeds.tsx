import React from "react";

import "./index.css";
import styles from "./Feeds.module.scss";

//3 TanStack Libraries!!!
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { QueryClient, QueryClientProvider, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtual } from "react-virtual";

import { fetchData, Person, PersonApiResponse } from "./makeData";
import { ContentMainCenter } from "../content_area/ContentArea";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";
import dayjs from "dayjs";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";
import { GetPrfsProofInstancesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstancesResponse";
import { prfsApi2 } from "@taigalabs/prfs-api-js";

const fetchSize = 20;

function Feeds() {
  const rerender = React.useReducer(() => ({}), {})[1];

  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "firstName",
        cell: info => info.getValue(),
      },
      {
        accessorFn: row => row.lastName,
        id: "lastName",
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        size: 50,
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        size: 50,
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        size: 80,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: info => info.getValue<Date>().toLocaleString(),
      },
    ],
    []
  );

  // const columns = React.useMemo<ColumnDef<PrfsProofInstanceSyn1>[]>(
  //   () => [
  //     {
  //       accessorFn: row => row.img_url,
  //       header: "Img url",
  //       cell: info => {
  //         const img_url = info.getValue() as string;

  //         return (
  //           <div className={styles.imgCol}>
  //             <CaptionedImg img_url={img_url} size={50} />
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       accessorFn: row => row.proof_label,
  //       header: "Label",
  //     },
  //     {
  //       accessorFn: row => row.created_at,
  //       header: "Created At",
  //       cell: info => {
  //         const val = info.getValue() as string;
  //         const day = dayjs(val);
  //         return day.format("YYYY-MM-DD");
  //       },
  //     },
  //     {
  //       accessorFn: row => row,
  //       header: "Prioritized inputs",
  //       cell: info => {
  //         const row = info.getValue() as PrfsProofInstanceSyn1;

  //         const { public_inputs } = row;

  //         let values = [];
  //         for (const meta of row.public_inputs_meta as PublicInputMeta[]) {
  //           if (meta.show_priority === 0) {
  //             const { name } = meta;
  //             if (public_inputs[name]) {
  //               values.push(public_inputs[name]);
  //             }
  //           }
  //         }

  //         return values;
  //       },
  //     },
  //     {
  //       accessorFn: row => row.proof_instance_id,
  //       header: "Proof instance id",
  //     },
  //   ],
  //   []
  // );

  // react-query has an useInfiniteQuery hook just for this situation!
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<PersonApiResponse>(
    ["table-data", sorting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
    async ({ pageParam = 0 }) => {
      const start = pageParam * fetchSize;
      const fetchedData = fetchData(start, fetchSize, sorting); //pretend api call
      return fetchedData;
    },
    {
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: false,
      refetchOnWindowFocus: false,
    }
  );

  // const { data, fetchNextPage, isFetching, isLoading } =
  //   useInfiniteQuery<GetPrfsProofInstancesResponse>(
  //     ["get_prfs_proof_instances"],
  //     async ({ pageParam = 0 }) => {
  //       const start = pageParam * fetchSize;

  //       const { payload } = await prfsApi2("get_prfs_proof_instances", {
  //         page_idx: start,
  //         page_size: fetchSize,
  //       });
  //       return payload;
  //     },
  //     {
  //       getNextPageParam: (_lastGroup, groups) => groups.length,
  //       keepPreviousData: false,
  //       refetchOnWindowFocus: false,
  //     }
  //   );

  console.log(data);
  const flatData = React.useMemo(() => data?.pages?.flatMap(page => page.data) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  // we must flatten the array of arrays from the useInfiniteQuery hook
  // const flatData = React.useMemo(
  //   () => data?.pages?.flatMap(page => page.prfs_proof_instances_syn1) ?? [],
  //   [data]
  // );
  // const totalDBRowCount = data?.pages?.[0]?.table_row_count ?? 0;
  // const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
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

  console.log(22, totalFetched, totalDBRowCount, flatData);

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
  });

  const { rows } = table.getRowModel();

  //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
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
    <div className={styles.wrapper}>
      <div
        className={styles.feedContainer}
        onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
      >
        <ContentMainCenter>
          <div>
            {paddingTop > 0 && (
              <div>
                <div style={{ height: `${paddingTop}px` }} />
              </div>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] as any;
              return (
                <div key={row.id}>
                  {row.getVisibleCells().map((cell: any) => {
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
        </ContentMainCenter>
        <div className={styles.rightBarContainer}>5</div>
      </div>
    </div>
  );
}

export default Feeds;
