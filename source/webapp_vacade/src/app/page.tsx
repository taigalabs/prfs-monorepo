"use client";

import React from "react";

import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import ContentArea from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
import HomeTimelineFeeds from "@/components/home_timeline_feeds/HomeTimelineFeeds";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <DefaultLayout>
      <LeftBar />
      <ContentArea>
        <div className={styles.container}>
          <HomeTimelineFeeds />
        </div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default HomePage;
