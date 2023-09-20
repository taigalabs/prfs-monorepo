import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ContentMainCenter,
  ContentMainHeader,
  ContentMainInfiniteScroll,
  ContentMainPlaceholder,
  ContentMainRight,
} from "@/components/content_area/ContentArea";
import TimelineHeader from "@/components/timeline_feeds/TimelineHeader";
import RightBar from "@/components/right_bar/RightBar";

import styles from "./TimelineFeeds2.module.scss";

async function fetchServerPage(
  limit: number,
  offset: number = 0
): Promise<{ rows: string[]; nextOffset: number | undefined }> {
  const rows = new Array(limit).fill(0).map((e, i) => `Async loaded row #${i + offset * limit}`);

  await new Promise(r => setTimeout(r, 500));

  return { rows, nextOffset: offset + 1 };
}

const TimelineFeeds2: React.FC<TimelineFeeds2Props> = ({ channelId }) => {
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(["projects"], ctx => fetchServerPage(10, ctx.pageParam), {
      getNextPageParam: lastPage => lastPage.nextOffset,
    });

  const allRows = data ? data.pages.flatMap(d => d.rows) : [];
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      // console.log(55, containerRefElement, rightBarContainerRef.current);
      if (containerRefElement && rightBarContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        const { scrollHeight: sh, scrollTop: st, clientHeight: ch } = rightBarContainerRef.current!;

        if (ch < clientHeight) {
          rightBarContainerRef.current!.style.top = `0px`;
        } else {
          const delta = clientHeight + scrollTop - ch;
          if (delta >= 0) {
            rightBarContainerRef.current.style.transform = `translateY(${delta}px)`;
          } else {
            rightBarContainerRef.current!.style.transform = "translateY(0px)";
          }
        }
      }
    },
    [fetchNextPage, isFetching, rightBarContainerRef.current]
  );

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

  const items = rowVirtualizer.getVirtualItems();

  return (
    <div className={styles.wrapper}>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <ContentMainInfiniteScroll
          dRef={parentRef}
          onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        >
          <ContentMainCenter
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            <ContentMainHeader>
              <TimelineHeader channelId={channelId} />
            </ContentMainHeader>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${items[0].start}px)`,
              }}
            >
              <ContentMainPlaceholder />
              {items.map(virtualRow => {
                const isLoaderRow = virtualRow.index > allRows.length - 1;
                const post = allRows[virtualRow.index];

                return (
                  <div
                    key={virtualRow.index}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                  >
                    {isLoaderRow
                      ? hasNextPage
                        ? "Loading more..."
                        : "Nothing more to load"
                      : post}
                  </div>
                );
              })}
            </div>
          </ContentMainCenter>
          <ContentMainRight>
            <RightBar />
          </ContentMainRight>
        </ContentMainInfiniteScroll>
      )}
      <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div>
    </div>
  );
};

export default TimelineFeeds2;

export interface TimelineFeeds2Props {
  channelId: string;
}
