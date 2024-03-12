"use client";

import React from "react";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./Channels.module.scss";
import ChannelRow from "./ChannelRow";
import {
  InfiniteScrollMain,
  InfiniteScrollRight,
  InfiniteScrollWrapper,
  InfiniteScrollInner,
  InfiniteScrollLeft,
  InfiniteScrollRowWrapper,
  InfiniteScrollRowContainerOuter,
  InfiniteScrollRowContainerInner,
} from "@/components/infinite_scroll/InfiniteScrollComponents";
import GlobalHeader from "@/components/global_header/GlobalHeader";
import ChannelMenu from "./ChannelMenu";

const Channels: React.FC<ChannelsProps> = ({}) => {
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_shy_channels"],
      queryFn: async ({ pageParam = 0 }) => {
        return await shyApi2({
          type: "get_shy_channels",
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
          return d.payload.rows;
        } else {
          [];
        }
      })
    : [];

  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  React.useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

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
    virtualizer.getVirtualItems(),
  ]);

  if (status === "error") {
    return <span>Error: {(error as Error).message}</span>;
  }

  const items = virtualizer.getVirtualItems();
  return (
    <InfiniteScrollWrapper innerRef={parentRef}>
      <GlobalHeader />
      <InfiniteScrollInner>
        <InfiniteScrollLeft>{null}</InfiniteScrollLeft>
        <InfiniteScrollMain>
          <ChannelMenu />
          {status === "pending" ? (
            <div className={styles.loading}>
              <Spinner />
            </div>
          ) : (
            <>
              <InfiniteScrollRowContainerOuter
                className={styles.rowContainerOuter}
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                }}
              >
                <InfiniteScrollRowContainerInner
                  style={{
                    transform: `translateY(${items[0]?.start ?? 0}px)`,
                  }}
                >
                  {virtualizer.getVirtualItems().map(virtualRow => {
                    const isLoaderRow = virtualRow.index > allRows.length - 1;
                    const row = allRows[virtualRow.index];

                    return (
                      <InfiniteScrollRowWrapper
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                        className={styles.row}
                        key={virtualRow.index}
                        data-index={virtualRow.index}
                        ref={virtualizer.measureElement}
                      >
                        {isLoaderRow ? (
                          <span>Loading...</span>
                        ) : (
                          row && <ChannelRow channel={row} />
                        )}
                      </InfiniteScrollRowWrapper>
                    );
                  })}
                </InfiniteScrollRowContainerInner>
              </InfiniteScrollRowContainerOuter>
            </>
          )}
        </InfiniteScrollMain>
        <InfiniteScrollRight>{null}</InfiniteScrollRight>
      </InfiniteScrollInner>
    </InfiniteScrollWrapper>
  );
};

export default Channels;

export interface ChannelsProps {}
