import React, { Suspense } from "react";

import styles from "./ChannelPage.module.scss";
import DefaultLayout, { DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import Topic from "@/components/topic/Topic";

const TopicPage: React.FC<ChannelPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <Suspense>
        <DefaultMain>
          <Topic topicId={params.topic_id} channelId={params.channel_id} />
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
