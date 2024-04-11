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
import Content from "./Welcome.mdx";
import { urls } from "@/urls";
import { paths, searchParamKeys } from "@/paths";

const Welcome: React.FC<WelcomeProps> = ({}) => {
  const router = useRouter();
  const isFontReady = useIsFontReady();
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);
  const { isCredentialInitialized, shyCredential } = useSignedInShyUser();
  const handleScroll = useHandleScroll(parentRef, rightBarContainerRef);

  React.useEffect(() => {
    if (isCredentialInitialized && !shyCredential) {
      const href = encodeURI(window.location.href);
      router.push(`${paths.account__sign_in}?${searchParamKeys.continue}=${href}`);
    }
  }, [isCredentialInitialized, router, shyCredential]);

  return isFontReady && shyCredential ? (
    <InfiniteScrollWrapper innerRef={parentRef} handleScroll={handleScroll}>
      <GlobalHeader />
      <InfiniteScrollInner>
        <InfiniteScrollLeft>{null}</InfiniteScrollLeft>
        <InfiniteScrollMain>
          <div className={styles.wrapper}>
            <Content
              attestationLink={urls.$prfs_proof__attestations__create_crypto_asset}
              accountId={shyCredential.account_id}
            />
          </div>
        </InfiniteScrollMain>
      </InfiniteScrollInner>
    </InfiniteScrollWrapper>
  ) : (
    <Loading>Loading</Loading>
  );
};

export default Welcome;

export interface WelcomeProps {}
