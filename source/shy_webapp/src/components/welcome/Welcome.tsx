"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./Welcome.module.scss";
import GlobalHeader from "../global_header/GlobalHeader";
import { useSignedInShyUser } from "@/hooks/user";
import { useIsFontReady } from "@/hooks/font";
import {
  InfiniteScrollInner,
  InfiniteScrollLeft,
  InfiniteScrollMain,
  InfiniteScrollWrapper,
} from "@/components/infinite_scroll/InfiniteScrollComponents";
import { useHandleScroll } from "@/hooks/scroll";
import Loading from "@/components/loading/Loading";

const Welcome: React.FC<WelcomeProps> = ({}) => {
  const router = useRouter();
  const isFontReady = useIsFontReady();
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const handleScroll = useHandleScroll(parentRef, rightBarContainerRef);

  return isFontReady && shyCredential ? (
    <InfiniteScrollWrapper innerRef={parentRef} handleScroll={handleScroll}>
      <GlobalHeader />
      <InfiniteScrollInner>
        <InfiniteScrollLeft>{null}</InfiniteScrollLeft>
        <InfiniteScrollMain>1</InfiniteScrollMain>
      </InfiniteScrollInner>
    </InfiniteScrollWrapper>
  ) : (
    <Loading>Loading</Loading>
  );
};

export default Welcome;

export interface WelcomeProps {}
