"use client";

import React from "react";

import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { ContentMain, ContentLeft } from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
import HomeTimelineFeeds from "@/components/home_timeline_feeds/HomeTimelineFeeds";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);

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

export default HomePage;
