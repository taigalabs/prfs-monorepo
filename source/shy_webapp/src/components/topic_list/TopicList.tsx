import React from "react";
import cn from "classnames";
import { GiDiamonds } from "@react-icons/all-files/gi/GiDiamonds";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { shyApi2 } from "@taigalabs/shy-api-js";
import dayjs from "dayjs";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { EnterShyChannelToken } from "@taigalabs/shy-entities/bindings/EnterShyChannelToken";
import { useRouter } from "next/navigation";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import DiamondPlaceholder from "@taigalabs/prfs-react-lib/src/diamond_placeholder/DiamondPlaceholder";

import styles from "./TopicList.module.scss";
import TopicRow from "./TopicRow";
import {
  InfiniteScrollRowContainerOuter,
  InfiniteScrollRowContainerInner,
} from "@/components/infinite_scroll/InfiniteScrollComponents";
import Loading from "@/components/loading/Loading";
import { useAppDispatch } from "@/state/hooks";
import { useShyCache } from "@/hooks/user";
import { makeEnterShyChannelCacheKey } from "@/cache";
import { removeCacheItem } from "@/state/userReducer";

const TopicList: React.FC<TopicListProps> = ({ parentRef, channel, className, placeholder }) => {
  const i18n = usePrfsI18N();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [msg, setMsg] = React.useState(null);

  const { shyCache, isCacheInitialized } = useShyCache();
  const [token, setToken] = React.useState<EnterShyChannelToken | null>(null);

  React.useEffect(() => {
    if (isCacheInitialized && shyCache && channel.type === "Closed") {
      const cacheKey = makeEnterShyChannelCacheKey(channel.channel_id);
      const val = shyCache[cacheKey];

      if (val) {
        try {
          const token: EnterShyChannelToken = JSON.parse(shyCache[cacheKey]);
          setToken(token);
        } catch (err) {
          dispatch(removeCacheItem(cacheKey));
        }
      }
    }
  }, [shyCache, setMsg, dispatch, setToken]);

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      enabled: (channel.type === "Closed" && !!token) || true,
      queryKey: ["get_shy_topics", channel.channel_id, token],
      queryFn: async ({ pageParam = 0 }) => {
        return await shyApi2({
          type: "get_shy_topics",
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
          return d.payload.shy_topics;
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

  const now = dayjs();

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
      className={cn(className)}
      style={{
        height: `${virtualizer.getTotalSize()}px`,
      }}
    >
      <InfiniteScrollRowContainerInner
        style={{
          transform: `translateY(${items[0]?.start ?? 0}px)`,
        }}
      >
        {status === "success" && items.length === 0 && (
          <div className={styles.emptyBoard}>{placeholder ?? i18n.no_records_to_show}</div>
        )}
        {items.map(virtualRow => {
          const isLoaderRow = virtualRow.index > allRows.length - 1;
          const topic = allRows[virtualRow.index];
          return (
            <div
              className={styles.row}
              key={virtualRow.index}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
            >
              {isLoaderRow
                ? hasNextPage
                  ? "Loading more..."
                  : "Nothing more to load"
                : topic && <TopicRow topic={topic} now={now} channelId={channel.channel_id} />}
            </div>
          );
        })}
        {status === "success" && items.length > 0 && <DiamondPlaceholder />}
      </InfiniteScrollRowContainerInner>
    </InfiniteScrollRowContainerOuter>
  );
};

export default TopicList;

export interface TopicListProps {
  parentRef: React.MutableRefObject<HTMLDivElement | null>;
  channel: ShyChannel;
  className?: string;
  placeholder?: React.ReactNode;
}
