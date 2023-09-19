"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import styles from "./ChannelPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { ContentMain, ContentLeft } from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
import TimelineFeeds from "@/components/timeline_feeds/TimelineFeeds";
import { paths } from "@/paths";

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isPostPage = searchParams.get("post") !== null;

  console.log(111, isPostPage);

  return (
    <DefaultLayout>
      <ContentLeft>
        <LeftBar />
      </ContentLeft>
      <ContentMain>
        <div className={styles.container}>
          {isPostPage ? (
            <div>333333333333333</div>
          ) : (
            <TimelineFeeds channelId={params.channel_id} />
          )}
        </div>
      </ContentMain>
    </DefaultLayout>
  );
};

export default ChannelPage;

export interface ChannelPageProps {
  params: {
    channel_id: string;
  };
}
