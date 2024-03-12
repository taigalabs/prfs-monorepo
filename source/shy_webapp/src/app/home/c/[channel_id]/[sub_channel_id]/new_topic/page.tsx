import React, { Suspense } from "react";

import styles from "./ChannelPage.module.scss";
import DefaultLayout, { DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import Channel from "@/components/channel/Channel";

const NewTopicPage: React.FC<ChannelPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <Suspense>
        <DefaultMain>
          <Channel channelId={params.channel_id} isNewTopic />
        </DefaultMain>
      </Suspense>
    </DefaultLayout>
  );
};

export default NewTopicPage;

export interface ChannelPageProps {
  params: {
    channel_id: string;
  };
}
