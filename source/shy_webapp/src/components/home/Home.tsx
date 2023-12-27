"use client";

import React from "react";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import LeftBar from "@/components/left_bar/LeftBar";
import TimelineFeeds from "@/components/timeline_feeds/TimelineFeeds";
import { DefaultHeader, DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import LeftBarDrawer from "./LeftBarDrawer";

const Home: React.FC<HomeProps> = () => {
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);
  const handleClickShowLeftBarDrawer = React.useCallback(
    (open?: boolean) => {
      if (open !== undefined) {
        setIsLeftBarDrawerVisible(open);
      } else {
        setIsLeftBarDrawerVisible(v => !v);
      }
    },
    [setIsLeftBarDrawerVisible],
  );

  return (
    <div className={styles.wrapper}>
      <DefaultHeader>
        <div className={styles.leftBarContainer}>
          <LeftBar />
        </div>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <LeftBar />
        </LeftBarDrawer>
      </DefaultHeader>
      <DefaultMain>
        <TimelineFeeds channelId="default" />
      </DefaultMain>
    </div>
  );
};

export default Home;

export interface HomeProps {}
