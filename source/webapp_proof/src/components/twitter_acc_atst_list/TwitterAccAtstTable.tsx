import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";

import styles from "./TwitterAccAtstTable.module.scss";

export interface Data {
  rows: Row[];
  nextId: number;
}

export interface Row {
  name: string;
  id: number;
}

export async function fetchServerPage2(offset: number, pageSize: number) {
  console.log("fetch", offset);

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
  console.log("fetch nextId", nextId);
  return { rows, nextId };
}

const TwitterAccAtstTable: React.FC<TwitterAccAtstTableProps> = () => {
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
      const res = await fetchServerPage2(pageParam as any, 10);
      return res;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => lastPage.nextId ?? undefined,
  });

  const allRows = data ? data.pages.flatMap(d => d.rows) : [];
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
    <div className={styles.wrapper}>
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
    </div>
  );
};

export default TwitterAccAtstTable;

export interface TwitterAccAtstTableProps {}
