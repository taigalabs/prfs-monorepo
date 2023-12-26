"use client";

import React, { Suspense } from "react";
import { redirect, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import useLocalWallet from "@/hooks/useLocalWallet";
import { useAppSelector } from "@/state/hooks";
import { ContentLeft, ContentMain } from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
// import TimelineFeeds from "@/components/timeline_feeds/TimelineFeeds";
import TimelineFeeds2 from "@/components/timeline_feeds2/TimelineFeeds2";

const Home: React.FC<HomeProps> = () => {
  return (
    <div className={styles.wrapper}>
      <ContentLeft>
        <Suspense>
          <LeftBar />
        </Suspense>
      </ContentLeft>
      <ContentMain>
        <div className={styles.container}>
          <Suspense>
            <TimelineFeeds2 channelId="default" />
          </Suspense>
        </div>
      </ContentMain>
    </div>
  );
};

export default Home;

export interface HomeProps {}
