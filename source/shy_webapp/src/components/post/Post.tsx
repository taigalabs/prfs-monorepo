"use client";

import React from "react";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";

import styles from "./Post.module.scss";
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
import { useHandleScroll } from "@/hooks/scroll";

const Post: React.FC<PostProps> = ({ postId }) => {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);
  const isFontReady = useIsFontReady();
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const router = useRouter();

  // const { data: channelData, isFetching: channelDataIsFetching } = useQuery({
  //   queryKey: ["get_shy_channel"],
  //   queryFn: async () => {
  //     return shyApi2({ type: "get_shy_channel", channel_id: channelId });
  //   },
  // });
  // const channel = channelData?.payload?.shy_channel;

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
          123123
          {/* {channel ? ( */}
          {/*   <> */}
          {/*     <BoardMeta channel={channel} /> */}
          {/*     {isPost ? ( */}
          {/*       <CreatePostForm channel={channel} /> */}
          {/*     ) : ( */}
          {/*       <> */}
          {/*         <BoardMenu channelId={channel.channel_id} /> */}
          {/*         <Board parentRef={parentRef} channelId={channel.channel_id} /> */}
          {/*       </> */}
          {/*     )} */}
          {/*   </> */}
          {/* ) : ( */}
          {/*   <div> */}
          {/*     <Spinner /> */}
          {/*   </div> */}
          {/* )} */}
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

export default Post;

export interface PostProps {
  postId: string;
}
