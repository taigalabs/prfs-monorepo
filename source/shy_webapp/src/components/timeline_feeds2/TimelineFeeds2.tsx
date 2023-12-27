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
import RightBar from "@/components/right_bar/RightBar";
import { shyApi } from "@taigalabs/prfs-api-js";

import styles from "./TimelineFeeds2.module.scss";
import Row from "./Row";

const TimelineFeeds2: React.FC<TimelineFeeds2Props> = ({ channelId }) => {
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_shy_posts"],
      queryFn: async ({ pageParam = 0 }) => {
        return await shyApi("get_shy_posts", {
          offset: pageParam,
        });
      },
      initialPageParam: 0,
      getNextPageParam: lastPage => {
        if (lastPage.payload) {
          return lastPage.payload.next_offset;
        } else {
          return null;
        }
      },
    });

  const allRows = data
    ? data.pages.flatMap(d => {
        if (d.payload) {
          return d.payload.shy_posts;
        } else {
          [];
        }
      })
    : [];
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);

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
      <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div>
      {status === "pending" ? (
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
                    {isLoaderRow
                      ? hasNextPage
                        ? "Loading more..."
                        : "Nothing more to load"
                      : post && <Row post={post} />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.right}></div>
        </div>
      )}
    </div>
  );
};

export default TimelineFeeds2;

export interface TimelineFeeds2Props {
  channelId: string;
}
