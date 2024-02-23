"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./Channel.module.scss";
import Board from "@/components/board/Board";
import { useSignedInShyUser } from "@/hooks/user";
import { useIsFontReady } from "@/hooks/font";
import { paths } from "@/paths";

const Channel: React.FC<ChannelProps> = ({ channelId }) => {
  const isFontReady = useIsFontReady();
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isInitialized && !shyCredential) {
      router.push(`${paths.account__sign_in}?continue=power`);
    }
  }, [isInitialized, router]);

  return isFontReady ? (
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
