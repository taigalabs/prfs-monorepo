"use client";

import React from "react";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { useInfiniteQuery, useQuery } from "@taigalabs/prfs-react-lib/react_query";

import styles from "./Topic.module.scss";
import { useSignedInShyUser } from "@/hooks/user";
import { useIsFontReady } from "@/hooks/font";
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
import { paths, searchParamKeys } from "@/paths";
import BoardMeta from "@/components/board/BoardMeta";
import Loading from "@/components/loading/Loading";
import { useHandleScroll } from "@/hooks/scroll";
import TopicContent from "./TopicContent";
import PostList from "@/components/post_list/PostList";
import Row from "./Row";

function usePosts(topicId: string, channelId: string) {
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_shy_posts_of_topic", topicId, channelId],
      queryFn: async ({ pageParam = 0 }) => {
        return await shyApi2({
          type: "get_shy_posts_of_topic",
          topic_id: topicId,
          channel_id: channelId,
          offset: pageParam,
        });
      },
      enabled: !!topicId && !!channelId,
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
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return {
    rowVirtualizer,
    allRows,
    data,
    status,
    isFetching,
  };
}

const Topic: React.FC<TopicProps> = ({ topicId, channelId }) => {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);
  const isFontReady = useIsFontReady();
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const router = useRouter();
  const { data: channelData, isFetching: channelDataIsFetching } = useQuery({
    queryKey: ["get_shy_channel"],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_channel", channel_id: channelId });
    },
  });
  const channel = channelData?.payload?.shy_channel;
  const { rowVirtualizer, allRows } = usePosts(topicId, channelId);

  React.useEffect(() => {
    if (isInitialized && !shyCredential) {
      const href = encodeURI(window.location.href);
      router.push(`${paths.account__sign_in}?${searchParamKeys.continue}=${href}`);
    }
  }, [isInitialized, router, shyCredential]);

  const handleScroll = useHandleScroll(parentRef, rightBarContainerRef);

  return isFontReady && shyCredential ? (
    <InfiniteScrollWrapper innerRef={parentRef} handleScroll={handleScroll}>
      <GlobalHeader />
      <InfiniteScrollInner>
        <InfiniteScrollLeft>{null}</InfiniteScrollLeft>
        <InfiniteScrollMain>
          {channel ? (
            <>
              <BoardMeta channel={channel} noDesc />
              <TopicContent topicId={topicId} channel={channel} />
              <InfiniteScrollRowContainer
                className={styles.infiniteScroll}
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map(virtualRow => {
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
                      ref={rowVirtualizer.measureElement}
                    >
                      {isLoaderRow ? <span>Loading...</span> : row && <Row post={row} />}
                    </InfiniteScrollRowWrapper>
                  );
                })}
              </InfiniteScrollRowContainer>
            </>
          ) : (
            <Loading centerAlign>
              <Spinner />
            </Loading>
          )}
        </InfiniteScrollMain>
        <InfiniteScrollRight>{null}</InfiniteScrollRight>
      </InfiniteScrollInner>
    </InfiniteScrollWrapper>
  ) : (
    <>
      <Loading>Loading...</Loading>
      <span className={styles.fontLoadText} />
    </>
  );
};

export default Topic;

export interface TopicProps {
  topicId: string;
  channelId: string;
}
