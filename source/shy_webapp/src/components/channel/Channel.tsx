"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";

import styles from "./Channel.module.scss";
import Board from "@/components/board/Board";
import { useSignedInShyUser } from "@/hooks/user";
import { useIsFontReady } from "@/hooks/font";
import { paths, searchParamKeys } from "@/paths";
import Loading from "@/components/loading/Loading";

const Channel: React.FC<ChannelProps> = ({ channelId, isPost }) => {
  const isFontReady = useIsFontReady();
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const router = useRouter();
  const { data, error, isFetching } = useQuery({
    queryKey: ["get_shy_channel"],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_channel", channel_id: channelId });
    },
  });

  React.useEffect(() => {
    if (isInitialized && !shyCredential) {
      const href = encodeURI(window.location.href);
      router.push(`${paths.account__sign_in}?${searchParamKeys.continue}=${href}`);
    }
  }, [isInitialized, router, shyCredential]);

  const channel = data?.payload?.shy_channel;

  return isFontReady && shyCredential && channel ? (
    <Board channelId={channelId} channel={channel} />
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
