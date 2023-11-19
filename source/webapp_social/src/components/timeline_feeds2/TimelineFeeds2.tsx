"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ContentMainBody,
  ContentMainCenter,
  ContentMainHeader,
  ContentMainInfiniteScroll,
  ContentMainRight,
} from "@/components/content_area/ContentArea";
import TimelineHeader from "@/components/timeline_feeds/TimelineHeader";
import RightBar from "@/components/right_bar/RightBar";

import styles from "./TimelineFeeds2.module.scss";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Row from "./Row";

async function fetchServerPage(
  limit: number,
  offset: number = 0,
): Promise<{ rows: string[]; nextOffset: number | undefined }> {
  console.log("fetch", limit, offset);

  const rows = new Array(limit).fill(0).map((e, i) => `Async loaded row #${i + offset * limit}`);

  await new Promise(r => setTimeout(r, 500));

  return {
    rows,
    // nextOffset: offset + 1
    nextOffset: undefined,
  };
}

const TimelineFeeds2: React.FC<TimelineFeeds2Props> = ({ channelId }) => {
  // const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
  //   useInfiniteQuery(["projects"], ctx => fetchServerPage(10, ctx.pageParam), {
  //     getNextPageParam: lastPage => lastPage.nextOffset,
  //   });

  // const allRows = data ? data.pages.flatMap(d => d.rows) : [];
  // const parentRef = React.useRef<HTMLDivElement | null>(null);
  // const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);

  // const rowVirtualizer = useVirtualizer({
  //   count: hasNextPage ? allRows.length + 1 : allRows.length,
  //   getScrollElement: () => parentRef.current,
  //   estimateSize: () => 100,
  //   overscan: 5,
  // });

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ["get_prfs_proof_types"],
      async ({ pageParam = 0 }) => {
        const { payload } = await prfsApi2("get_social_posts", {
          page_idx: pageParam,
          page_size: 5,
        });
        return payload;
      },
      {
        getNextPageParam: lastPage => (lastPage.next_idx > -1 ? lastPage.next_idx : undefined),
      },
    );

  const allRows = data ? data.pages.flatMap(d => d.social_posts) : [];
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
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

  const handleScroll = React.useCallback(() => {
    // console.log(55, containerRefElement, rightBarContainerRef.current);
    if (parentRef.current && rightBarContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = parentRef.current;
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
  }, [isFetching, parentRef.current, rightBarContainerRef.current]);

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
        <div ref={parentRef} className={styles.feedContainer} onScroll={handleScroll}>
          <div className={styles.left}>
            <div className={styles.placeholder} />
            <div
              className={styles.infiniteScroll}
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {items.map(virtualRow => {
                const isLoaderRow = virtualRow.index > allRows.length - 1;
                const post = allRows[virtualRow.index];

                return (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className={styles.row}
                    key={virtualRow.index}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                  >
                    {isLoaderRow ? (
                      hasNextPage ? (
                        "Loading more..."
                      ) : (
                        "Nothing more to load"
                      )
                    ) : (
                      <Row post={post} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.right}></div>
        </div>
      )}
      {/* <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div> */}
    </div>
  );
};

export default TimelineFeeds2;

export interface TimelineFeeds2Props {
  channelId: string;
}
