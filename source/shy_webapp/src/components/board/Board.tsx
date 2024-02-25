"use client";

import React from "react";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

import styles from "./Board.module.scss";
import Row from "./Row";
import {
  InfiniteScrollMain,
  InfiniteScrollRight,
  InfiniteScrollWrapper,
  InfiniteScrollInner,
  InfiniteScrollLeft,
  InfiniteScrollRowContainer,
  InfiniteScrollRowWrapper,
} from "@/components/infinite_scroll/InfiniteScrollComponents";
import GlobalHeader from "@/components/global_header/GlobalHeader";
import BoardMenu from "./BoardMenu";
import BoardMeta from "./BoardMeta";

const Board: React.FC<BoardProps> = ({ channel }) => {
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_shy_posts", channel.channel_id],
      queryFn: async ({ pageParam = 0 }) => {
        return await shyApi2({
          type: "get_shy_posts",
          channel_id: channel.channel_id,
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

  if (status === "error") {
    return <span>Error: {(error as Error).message}</span>;
  }

  return (
    <InfiniteScrollWrapper innerRef={parentRef} handleScroll={handleScroll}>
      <GlobalHeader />
      <InfiniteScrollInner>
        <InfiniteScrollLeft>{null}</InfiniteScrollLeft>
        <InfiniteScrollMain>
          <BoardMeta channel={channel} />
          <BoardMenu channelId={channel.channel_id} />
          {status === "pending" ? (
            <div className={styles.loading}>
              <Spinner />
            </div>
          ) : (
            <InfiniteScrollRowContainer
              className={styles.infiniteScroll}
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map(virtualRow => {
                const isLoaderRow = virtualRow.index > allRows.length - 1;
                const post = allRows[virtualRow.index];

                return (
                  <InfiniteScrollRowWrapper
                    style={{
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
                  </InfiniteScrollRowWrapper>
                );
              })}
            </InfiniteScrollRowContainer>
          )}
        </InfiniteScrollMain>
        <InfiniteScrollRight>{null}</InfiniteScrollRight>
      </InfiniteScrollInner>
    </InfiniteScrollWrapper>
  );
};

export default Board;

export interface BoardProps {
  channel: ShyChannel;
}
