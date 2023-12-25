import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInView } from "react-intersection-observer";

import styles from "./TwitterAccAtstTable.module.scss";
import { fetchData, Person } from "./fetchData";

export interface Data {
  rows: Row[];
  nextId: number;
}

export interface Row {
  name: string;
  id: number;
}

async function fetchServerPage(
  limit: number,
  offset: number = 0,
): Promise<{ rows: string[]; nextOffset: number }> {
  const rows = new Array(limit).fill(0).map((e, i) => `Async loaded row #${i + offset * limit}`);

  await new Promise(r => setTimeout(r, 500));

  return { rows, nextOffset: offset + 1 };
}

export async function fetchServerPage2(offset: number) {
  console.log("fetch", offset);
  const pageSize = 5;

  const rows = Array(pageSize)
    .fill(0)
    .map((_, i) => {
      // return `Async loaded row #${i + pageSize * crs}`;
      return {
        name: "Project " + (i + offset) + ` (server time: ${Date.now()})`,
        id: i + offset,
      };
    });

  const nextId = offset + pageSize;

  console.log("fetch", nextId);

  return { rows, nextId };
}

function TwitterAccAtstTable() {
  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      {
        accessorKey: "firstName",
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.name,
        id: "name",
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
    ],
    [],
  );

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery<Data>({
    queryKey: ["projects"],
    queryFn: async ({ pageParam }) => {
      console.log("pageParam", pageParam);
      const res = await fetchServerPage2(pageParam as any);
      return res;
    },
    initialPageParam: 0,
    // getPreviousPageParam: (firstPage: any) => {
    //   return firstPage.previousId ?? undefined;
    // },
    getNextPageParam: (lastPage: any) => lastPage.nextId ?? undefined,
  });

  // console.log("data", data);

  const allRows = data ? data.pages.flatMap(d => d.rows) : [];

  const table = useReactTable({
    data: allRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // debugTable: true,
  });

  const { rows } = table.getRowModel();

  // console.log("allRows", allRows);

  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= allRows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div>
      <p>
        This infinite scroll example uses React Query's useInfiniteScroll hook to fetch infinite
        data from a posts endpoint and then a rowVirtualizer is used along with a loader-row placed
        at the bottom of the list to trigger the next page to load.
      </p>

      <br />
      <br />

      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <div
          ref={parentRef}
          className="List"
          style={{
            height: `500px`,
            width: `100%`,
            overflow: "auto",
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const isLoaderRow = virtualRow.index > allRows.length - 1;
              const post = allRows[virtualRow.index];
              // const row = rows[virtualRow.index];
              // console.log(11, rows, row);

              // return (
              //   row && (
              //     <tr key={row.id}>
              //       {row.getVisibleCells().map(cell => {
              //         return (
              //           <td key={cell.id}>
              //             {flexRender(cell.column.columnDef.cell, cell.getContext())}
              //           </td>
              //         );
              //       })}
              //     </tr>
              //   )
              // );

              return (
                <div
                  key={virtualRow.index}
                  className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow
                    ? hasNextPage
                      ? "Loading more..."
                      : "Nothing more to load"
                    : post.name}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div>
      <br />
      <br />
      {process.env.NODE_ENV === "development" ? (
        <p>
          <strong>Notice:</strong> You are currently running React in development mode. Rendering
          performance will be slightly degraded until this application is build for production.
        </p>
      ) : null}
    </div>
  );
}

// const TwitterAccAtstTable: React.FC = () => {
//   const columns = React.useMemo<ColumnDef<Person>[]>(
//     () => [
//       {
//         accessorKey: "firstName",
//         cell: info => info.getValue(),
//         footer: props => props.column.id,
//       },
//       {
//         accessorFn: row => row.lastName,
//         id: "lastName",
//         cell: info => info.getValue(),
//         header: () => <span>Last Name</span>,
//         footer: props => props.column.id,
//       },
//       {
//         accessorKey: "visits",
//         header: () => <span>Visits</span>,
//         footer: props => props.column.id,
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         footer: props => props.column.id,
//       },
//       {
//         accessorKey: "progress",
//         header: "Profile Progress",
//         footer: props => props.column.id,
//       },
//     ],
//     [],
//   );

//   const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const fetchDataOptions = {
//     pageIndex,
//     pageSize,
//   };

//   const dataQuery = useQuery({
//     queryKey: ["data"],
//     queryFn: () => fetchData(fetchDataOptions),
//   });

//   const pagination = React.useMemo(
//     () => ({
//       pageIndex,
//       pageSize,
//     }),
//     [pageIndex, pageSize],
//   );

//   const table = useReactTable({
//     data: dataQuery.data?.rows ?? defaultData,
//     columns,
//     pageCount: dataQuery.data?.pageCount ?? -1,
//     state: {
//       pagination,
//     },
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     manualPagination: true,
//     // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
//     debugTable: true,
//   });

//   const { firstRowIdx, lastRowIdx } = React.useMemo(() => {
//     const firstRowIdx = pageIndex === 0 ? 1 : (pageIndex + 1) * pageSize;
//     const rowCount = table.getRowModel().rows.length;

//     return {
//       firstRowIdx,
//       lastRowIdx: firstRowIdx + rowCount - 1,
//     };
//   }, [pageIndex, pageSize, table.getRowModel()]);

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.navigation}>
//         <div className={styles.location}>
//           {firstRowIdx} - {lastRowIdx}
//         </div>
//         <div className={styles.btnGroup}>
//           <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
//             <IoIosArrowBack />
//           </button>
//           <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
//             <IoIosArrowForward />
//           </button>
//         </div>
//       </div>
//       <table>
//         <thead>
//           {table.getHeaderGroups().map(headerGroup => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map(header => {
//                 return (
//                   <th key={header.id} colSpan={header.colSpan}>
//                     {header.isPlaceholder ? null : (
//                       <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
//                     )}
//                   </th>
//                 );
//               })}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.map(row => {
//             return (
//               <tr key={row.id}>
//                 {row.getVisibleCells().map(cell => {
//                   return (
//                     <td key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   );
//                 })}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       {dataQuery.isFetching ? "Loading..." : null}
//     </div>
//   );
// };

export default TwitterAccAtstTable;
