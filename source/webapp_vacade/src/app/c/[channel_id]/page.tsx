"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./ChannelPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { ContentMain, ContentLeft } from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
import HomeTimelineFeeds from "@/components/home_timeline_feeds/HomeTimelineFeeds";
import { paths } from "@/paths";

const ChannelPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  React.useEffect(() => {
    router.push(`${paths.c}/crypto`);
  }, [router]);

  return (
    <DefaultLayout>
      <ContentLeft>
        <LeftBar />
      </ContentLeft>
      <ContentMain>
        <div className={styles.container}>
          <HomeTimelineFeeds />
        </div>
      </ContentMain>
    </DefaultLayout>
  );
};

export default ChannelPage;
