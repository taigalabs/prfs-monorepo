"use client";

import React from "react";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./Channel.module.scss";
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
import CreateTopicForm from "@/components/create_topic/CreateTopicForm";
import { paths, searchParamKeys } from "@/paths";
import Board from "@/components/board/Board";
import BoardMeta from "@/components/board/BoardMeta";
import BoardMenu from "@/components/board/BoardMenu";
import Loading from "@/components/loading/Loading";
import { useHandleScroll } from "@/hooks/scroll";

const Channel: React.FC<ChannelProps> = ({ channelId, isNewTopic, subChannelId }) => {
  const i18n = usePrfsI18N();
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);
  const isFontReady = useIsFontReady();
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const router = useRouter();

  const {
    data: channelData,
    isFetching: channelDataIsFetching,
    error,
  } = useQuery({
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

  React.useEffect(() => {
    if (error) {
      console.error("err fetchin data: %o", error);
    }
  }, [error]);

  const handleScroll = useHandleScroll(parentRef, rightBarContainerRef);

  const boardPlaceholderElem = React.useMemo(() => {
    return "No post has been made yet";
  }, []);

  return isFontReady && shyCredential ? (
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
              <BoardMeta channel={channel} />
              {isNewTopic ? (
                <CreateTopicForm channel={channel} subChannelId={subChannelId} />
              ) : (
                <>
                  <BoardMenu channelId={channel.channel_id} />
                  <Board
                    parentRef={parentRef}
                    channelId={channel.channel_id}
                    placeholder={boardPlaceholderElem}
                  />
                </>
              )}
            </>
          ) : (
            <div className={styles.noChannelFound}>{i18n.no_channel_found}</div>
          )}
        </InfiniteScrollMain>
        <InfiniteScrollRight>{null}</InfiniteScrollRight>
      </InfiniteScrollInner>
    </InfiniteScrollWrapper>
  ) : (
    <>
      <Loading>Loading</Loading>
      <span className={styles.fontLoadText} />
    </>
  );
};

export default Channel;

export interface ChannelProps {
  channelId: string;
  subChannelId: string;
  isNewTopic?: boolean;
}
