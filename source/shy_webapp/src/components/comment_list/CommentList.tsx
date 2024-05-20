import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { shyApi2 } from "@taigalabs/shy-api-js";
import dayjs from "dayjs";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import DiamondPlaceholder from "@taigalabs/prfs-react-lib/src/diamond_placeholder/DiamondPlaceholder";

import styles from "./CommentList.module.scss";
import CommenttRow from "./CommentRow";
import {
  InfiniteScrollRowContainerInner,
  InfiniteScrollRowContainerOuter,
} from "@/components/infinite_scroll/InfiniteScrollComponents";
import Loading from "@/components/loading/Loading";
// import TopicFooter from "@/components/topic/TopicFooter";
import ZeroCommentMsg from "./ZeroCommentMsg";
import CommentRow from "./CommentRow";

const CommentList: React.FC<PostListProps> = ({
  parentRef,
  channel,
  topicId,
  subChannelId,
  rerender,
  nonce,
}) => {
  const i18n = usePrfsI18N();

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_shy_comments_of_topic", topicId, channel.channel_id, nonce],
      queryFn: async ({ pageParam = 0 }) => {
        return await shyApi2({
          type: "get_shy_comments_of_topic",
          topic_id: topicId,
          channel_id: channel.channel_id,
          offset: pageParam,
        });
      },
      enabled: !!topicId,
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
          return d.payload.shy_comments_with_proofs;
        } else {
          [];
        }
      })
    : [];

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 74,
    overscan: 5,
  });

  const now = React.useMemo(() => {
    return dayjs();
  }, []);

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

  if (status === "pending") {
    return (
      <Loading centerAlign>
        <Spinner />
      </Loading>
    );
  }

  const items = virtualizer.getVirtualItems();
  return (
    <InfiniteScrollRowContainerOuter
      style={{
        height: `${virtualizer.getTotalSize()}px`,
      }}
    >
      <InfiniteScrollRowContainerInner
        className={styles.inner}
        style={{
          transform: `translateY(${items[0]?.start ?? 0}px)`,
        }}
      >
        {status === "success" && items.length === 0 && (
          <div className={styles.zeroCommentMsg}>
            <ZeroCommentMsg />
          </div>
        )}
        {items.map(virtualRow => {
          const isLoaderRow = virtualRow.index > allRows.length - 1;
          const comment = allRows[virtualRow.index];

          return (
            <div
              className={styles.row}
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
            >
              {isLoaderRow
                ? hasNextPage
                  ? "Loading more..."
                  : "Nothing more to load"
                : comment && (
                    <CommentRow
                      comment={comment}
                      now={now}
                      channel={channel}
                      handleSucceedPost={rerender}
                      subChannelId={subChannelId}
                    />
                  )}
            </div>
          );
        })}
        {/* {!hasNextPage && ( */}
        {/*   <TopicFooter topicId={topicId} channel={channel} subChannelId={subChannelId} /> */}
        {/* )} */}
      </InfiniteScrollRowContainerInner>
    </InfiniteScrollRowContainerOuter>
  );
};

export default CommentList;

export interface PostListProps {
  topicId: string;
  channel: ShyChannel;
  parentRef: React.MutableRefObject<HTMLDivElement | null>;
  subChannelId: string;
  rerender: React.DispatchWithoutAction;
  nonce: number;
}
