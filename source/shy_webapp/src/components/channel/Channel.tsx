"use client";

import React from "react";

import styles from "./ChannelPage.module.scss";
import DefaultLayout, { DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import CreatePostForm from "@/components/create_post_form/CreatePostForm";
import GlobalHeader from "@/components/global_header/GlobalHeader";
import Board from "@/components/board/Board";
import { useSignedInShyUser } from "@/hooks/user";
import { useIsFontReady } from "@/hooks/font";

const Channel: React.FC<ChannelProps> = ({ channelId }) => {
  // const { isInitialized } = useSignedInShyUser();
  const isFontReady = useIsFontReady();

  React.useEffect(() => {
    document.fonts.ready.then(() => {
      console.log(123);
    });
  }, []);

  return isFontReady ? <Board /> : <div>Loading</div>;
};

export default Channel;

export interface ChannelProps {
  channelId: string;
}
