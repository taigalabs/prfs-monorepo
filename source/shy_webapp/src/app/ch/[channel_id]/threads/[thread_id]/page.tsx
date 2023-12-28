"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./ThreadPage.module.scss";
import { i18nContext } from "@/i18n/context";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import { ContentMain, ContentLeft } from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
import { paths } from "@/paths";

const ThreadPage: React.FC<ThreadPageProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  React.useEffect(() => {
    // router.push(`${paths.c}/crypto`);
  }, [router]);

  return (
    <DefaultLayout>
      <ContentLeft>
        <LeftBar />
      </ContentLeft>
      <ContentMain>
        <div className={styles.container}>{/* <TimelineFeeds /> */}</div>
      </ContentMain>
    </DefaultLayout>
  );
};

export default ThreadPage;

export interface ThreadPageProps {
  params: {
    thread_id: string;
  };
}
