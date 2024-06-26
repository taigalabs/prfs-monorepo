import React, { Suspense } from "react";

import styles from "./ChannelPage.module.scss";
import DefaultLayout, { DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import Topic from "@/components/topic/Topic";
import { DEFAULT_SHY_SUB_CHANNEL_ID } from "@/channel";

const TopicPage: React.FC<ChannelPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <Suspense>
        <DefaultMain>
          <Topic
            topicId={params.topic_id}
            channelId={params.channel_id}
            subChannelId={DEFAULT_SHY_SUB_CHANNEL_ID}
          />
        </DefaultMain>
      </Suspense>
    </DefaultLayout>
  );
};

export default TopicPage;

export interface ChannelPageProps {
  params: {
    topic_id: string;
    channel_id: string;
  };
}
