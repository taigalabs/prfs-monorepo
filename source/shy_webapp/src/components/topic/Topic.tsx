"use client";

import React from "react";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";

import styles from "./Topic.module.scss";
import { useSignedInShyUser } from "@/hooks/user";
import { useIsFontReady } from "@/hooks/font";
import {
  InfiniteScrollMain,
  InfiniteScrollRight,
  InfiniteScrollWrapper,
  InfiniteScrollInner,
  InfiniteScrollLeft,
} from "@/components/infinite_scroll/InfiniteScrollComponents";
import GlobalHeader from "@/components/global_header/GlobalHeader";
import { paths, searchParamKeys } from "@/paths";
import ChannelMeta from "@/components/channel/ChannelMeta";
import Loading from "@/components/loading/Loading";
import { useHandleScroll } from "@/hooks/scroll";
import TopicContent from "./TopicContent";
import PostList from "@/components/post_list/PostList";

const Topic: React.FC<TopicProps> = ({ topicId, channelId, subChannelId }) => {
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
              <ChannelMeta channel={channel} noDesc noSubChannel small />
              <TopicContent topicId={topicId} channel={channel} />
              <PostList
                parentRef={parentRef}
                channel={channel}
                topicId={topicId}
                subChannelId={subChannelId}
              />
              {/* <TopicFooter topicId={topicId} channel={channel} subChannelId={subChannelId} /> */}
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
      <Loading centerAlign>
        <Spinner />
      </Loading>
      <span className={styles.fontLoadText} />
    </>
  );
};

export default Topic;

export interface TopicProps {
  topicId: string;
  channelId: string;
  subChannelId: string;
}
