"use client";

import React from "react";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";

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
import CreatePostForm from "@/components/create_post_form/CreatePostForm";
import { paths, searchParamKeys } from "@/paths";
import Board from "@/components/board/Board";
import BoardMeta from "@/components/board/BoardMeta";
import BoardMenu from "@/components/board/BoardMenu";
import Loading from "@/components/loading/Loading";

const Channel: React.FC<ChannelProps> = ({ channelId, isPost }) => {
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

  const handleScroll = React.useCallback(() => {
    if (parentRef.current && rightBarContainerRef.current) {
      const { scrollTop, clientHeight } = parentRef.current;
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
  }, [parentRef.current, rightBarContainerRef.current]);

  return isFontReady && shyCredential ? (
    <InfiniteScrollWrapper innerRef={parentRef} handleScroll={handleScroll}>
      <GlobalHeader />
      <InfiniteScrollInner>
        <InfiniteScrollLeft>{null}</InfiniteScrollLeft>
        <InfiniteScrollMain>
          {channel ? (
            <>
              <BoardMeta channel={channel} />
              <BoardMenu channelId={channel.channel_id} />
              <Board parentRef={parentRef} channelId={channel.channel_id} />
            </>
          ) : (
            <div>
              <Spinner />
            </div>
          )}
        </InfiniteScrollMain>
        <InfiniteScrollRight>{null}</InfiniteScrollRight>
      </InfiniteScrollInner>
      {isPost && channel && <CreatePostForm channel={channel} />}
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
  isPost?: boolean;
}
