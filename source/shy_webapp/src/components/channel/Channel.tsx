"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./Channel.module.scss";
import Board from "@/components/board/Board";
import { useSignedInShyUser } from "@/hooks/user";
import { useIsFontReady } from "@/hooks/font";
import { paths, searchParamKeys } from "@/paths";

const Channel: React.FC<ChannelProps> = ({ channelId }) => {
  const isFontReady = useIsFontReady();
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isInitialized && !shyCredential) {
      const href = encodeURI(window.location.href);
      router.push(`${paths.account__sign_in}?${searchParamKeys.continue}=${href}`);
    }
  }, [isInitialized, router, shyCredential]);

  return isFontReady && shyCredential ? (
    <Board />
  ) : (
    <>
      <div className={styles.loading}>Loading</div>
      <span className={styles.fontLoadText} />
    </>
  );
};

export default Channel;

export interface ChannelProps {
  channelId: string;
}
