"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./Home.module.scss";
import LeftBar from "@/components/left_bar/LeftBar";
import TimelineFeeds from "@/components/timeline_feeds/TimelineFeeds";
import { DefaultHeader, DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import LeftBarDrawer from "@/components/left_bar/LeftBarDrawer";
import { useSignedInUser } from "@/hooks/user";
import { paths } from "@/paths";
import Loading from "@/components/loading/Loading";
import TimelineHeader from "../timeline_feeds/TimelineHeader";
import ChannelList from "@/components/channel_list/ChannelList";

const Home: React.FC<HomeProps> = () => {
  const router = useRouter();
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);
  const handleClickShowLeftBarDrawer = React.useCallback(
    (open?: boolean) => {
      if (open !== undefined) {
        setIsLeftBarDrawerVisible(!!open);
      } else {
        setIsLeftBarDrawerVisible(v => !v);
      }
    },
    [setIsLeftBarDrawerVisible],
  );

  const { isInitialized, shyCredential } = useSignedInUser();
  React.useEffect(() => {
    if (isInitialized) {
      if (shyCredential === null) {
        router.push(paths.account__sign_in);
      }
    }
  }, [isInitialized, shyCredential, router]);

  return isInitialized && shyCredential ? (
    <div className={styles.wrapper}>
      <DefaultHeader>
        <div className={styles.leftBarContainer}>
          <LeftBar credential={shyCredential} />
        </div>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <LeftBar credential={shyCredential} />
        </LeftBarDrawer>
      </DefaultHeader>
      <DefaultMain>
        <ChannelList
          credential={shyCredential}
          handleClickShowLeftBarDrawer={handleClickShowLeftBarDrawer as any}
        />
      </DefaultMain>
    </div>
  ) : (
    <Loading />
  );
};

export default Home;

export interface HomeProps {}
