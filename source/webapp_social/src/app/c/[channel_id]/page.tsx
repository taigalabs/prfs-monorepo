"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import styles from "./ChannelPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import { ContentMain, ContentLeft } from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
import TimelineFeeds from "@/components/timeline_feeds/TimelineFeeds";
import { paths } from "@/paths";
import TimelineFeeds2 from "@/components/timeline_feeds2/TimelineFeeds2";
import CreatePostForm from "@/components/create_post_form/CreatePostForm";
import { useAppSelector } from "@/state/hooks";
import useLocalWallet from "@/hooks/useLocalWallet";
import { useDispatch } from "react-redux";

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);
  useLocalWallet(dispatch);

  React.useEffect(() => {
    if (localPrfsAccount === null) {
      router.push(`${paths.sign_in}`);
    }
  }, [router]);

  const isPostPage = searchParams.get("post") !== null;

  return (
    <DefaultLayout>
      <ContentLeft>
        <LeftBar />
      </ContentLeft>
      <ContentMain>
        <div className={styles.container}>
          {isPostPage ? (
            <CreatePostForm channelId={params.channel_id} />
          ) : (
            <TimelineFeeds2 channelId={params.channel_id} />
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
