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
import TimelineFeeds2 from "@/components/timeline_feeds2/TimelineFeeds2";
import { DefaultHeader, DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";

const Home: React.FC<HomeProps> = () => {
  return (
    <div className={styles.wrapper}>
      <DefaultHeader>
        <LeftBar />
      </DefaultHeader>
      <DefaultMain>
        <TimelineFeeds2 channelId="default" />
      </DefaultMain>
    </div>
  );
};

export default Home;

export interface HomeProps {}
