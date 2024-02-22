"use client";

import React from "react";

import styles from "./Channel.module.scss";
import DefaultLayout, { DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import CreatePostForm from "@/components/create_post_form/CreatePostForm";
import GlobalHeader from "@/components/global_header/GlobalHeader";
import Board from "@/components/board/Board";
import { useSignedInShyUser } from "@/hooks/user";
import { useIsFontReady } from "@/hooks/font";

const Channel: React.FC<ChannelProps> = ({ channelId }) => {
  const isFontReady = useIsFontReady();

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
