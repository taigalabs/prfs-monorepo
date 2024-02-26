import React, { Suspense } from "react";

import styles from "./ChannelPage.module.scss";
import DefaultLayout, { DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import Channel from "@/components/channel/Channel";

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <Suspense>
        <DefaultMain>
          <Channel channelId={params.channel_id} isPost />
        </DefaultMain>
      </Suspense>
    </DefaultLayout>
  );
};

export default ChannelPage;

export interface ChannelPageProps {
  params: {
    channel_id: string;
  };
}
