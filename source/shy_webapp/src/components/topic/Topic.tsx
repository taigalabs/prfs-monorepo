"use client";

import React from "react";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useRerender } from "@taigalabs/prfs-react-lib/src/hooks/use_rerender";

import styles from "./Topic.module.scss";
import { useShyCache, useSignedInShyUser } from "@/hooks/user";
import {
  InfiniteScrollMain,
  InfiniteScrollRight,
  InfiniteScrollWrapper,
  InfiniteScrollInner,
  InfiniteScrollLeft,
} from "@/components/infinite_scroll/InfiniteScrollComponents";
import GlobalHeader from "@/components/global_header/GlobalHeader";
import ChannelMeta from "@/components/channel/ChannelMeta";
import Loading from "@/components/loading/Loading";
import { useHandleScroll } from "@/hooks/scroll";
import TopicContent from "./TopicContent";
import CommentList from "@/components/comment_list/CommentList";
import { TopicChannel } from "./TopicComponents";

const Topic: React.FC<TopicProps> = ({ topicId, channelId, subChannelId }) => {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);
  const { data: channelData, isFetching: channelDataIsFetching } = useQuery({
    queryKey: ["get_shy_channel"],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_channel", channel_id: channelId });
    },
  });
  const { rerender, nonce } = useRerender();
  const channel = channelData?.payload?.shy_channel;
  const { shyCache, isCacheInitialized } = useShyCache();

  const handleScroll = useHandleScroll(parentRef, rightBarContainerRef);

  return isCacheInitialized ? (
    <InfiniteScrollWrapper innerRef={parentRef} handleScroll={handleScroll}>
      <GlobalHeader />
      <InfiniteScrollInner>
        <InfiniteScrollLeft>{null}</InfiniteScrollLeft>
        <InfiniteScrollMain>
          {channel ? (
            <>
              <TopicChannel channel={channel} />
              <TopicContent
                topicId={topicId}
                channel={channel}
                rerender={rerender}
                subChannelId={subChannelId}
              />
              <CommentList
                parentRef={parentRef}
                channel={channel}
                topicId={topicId}
                subChannelId={subChannelId}
                nonce={nonce}
                rerender={rerender}
              />
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
    <Loading />
  );
};

export default Topic;

export interface TopicProps {
  topicId: string;
  channelId: string;
  subChannelId: string;
}
