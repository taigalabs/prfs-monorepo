"use client";

import React from "react";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./Channel.module.scss";
import { useShyCache } from "@/hooks/user";
import {
  InfiniteScrollMain,
  InfiniteScrollRight,
  InfiniteScrollWrapper,
  InfiniteScrollInner,
  InfiniteScrollLeft,
} from "@/components/infinite_scroll/InfiniteScrollComponents";
import GlobalHeader from "@/components/global_header/GlobalHeader";
import TopicList from "@/components/topic_list/TopicList";
import ChannelMeta from "@/components/channel/ChannelMeta";
import ChannelMenu from "@/components/channel/ChannelMenu";
import Loading from "@/components/loading/Loading";
import { useHandleScroll } from "@/hooks/scroll";
import { useShyChannel } from "@/requests";

const Channel: React.FC<ChannelProps> = ({ channelId, isNewTopic, subChannelId }) => {
  const i18n = usePrfsI18N();
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);
  const { shyCache, isCacheInitialized } = useShyCache();

  const { data: channelData, isFetching: channelDataIsFetching, error } = useShyChannel(channelId);
  const channel = channelData?.payload?.shy_channel;

  React.useEffect(() => {
    if (error) {
      console.error("err fetchin data: %o", error);
    }
  }, [error]);

  const handleScroll = useHandleScroll(parentRef, rightBarContainerRef);

  const boardPlaceholderElem = React.useMemo(() => {
    return "No post has been made yet";
  }, []);

  return isCacheInitialized ? (
    <InfiniteScrollWrapper innerRef={parentRef} handleScroll={handleScroll}>
      <GlobalHeader />
      <InfiniteScrollInner>
        <InfiniteScrollLeft>{null}</InfiniteScrollLeft>
        <InfiniteScrollMain>
          {channelData?.error && <Loading>{i18n.fetching_data_failed}</Loading>}
          {channelDataIsFetching && (
            <Loading centerAlign>
              <Spinner />
            </Loading>
          )}
          {channel ? (
            <>
              <ChannelMeta channel={channel} />
              <ChannelMenu channelId={channel.channel_id} />
              <TopicList
                parentRef={parentRef}
                channel={channel}
                placeholder={boardPlaceholderElem}
              />
            </>
          ) : (
            <div className={styles.noChannelFound}>{i18n.no_channel_found}</div>
          )}
        </InfiniteScrollMain>
        <InfiniteScrollRight>{null}</InfiniteScrollRight>
      </InfiniteScrollInner>
    </InfiniteScrollWrapper>
  ) : (
    <Loading />
  );
};

export default Channel;

export interface ChannelProps {
  channelId: string;
  subChannelId: string;
  isNewTopic?: boolean;
}
