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
import TimelineFeeds2 from "@/components/timeline_feeds2/TimelineFeeds2";
import CreatePostForm from "@/components/create_post_form/CreatePostForm";

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isPostPage = searchParams.get("post") !== null;

  return (
    <DefaultLayout>
      <ContentLeft>
        <LeftBar />
      </ContentLeft>
      <ContentMain>
        <div className={styles.container}>
          {isPostPage ? <CreatePostForm /> : <TimelineFeeds2 channelId={params.channel_id} />}
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
