import React, { Suspense } from "react";

import styles from "./ChannelPage.module.scss";
import DefaultLayout, { DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import Channel from "@/components/channel/Channel";

const SubChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <Suspense>
        <DefaultMain>
          <Channel channelId={params.channel_id} subChannelId={params.sub_channel_id} />
        </DefaultMain>
      </Suspense>
    </DefaultLayout>
  );
};

export default SubChannelPage;

export interface ChannelPageProps {
  params: {
    channel_id: string;
    sub_channel_id: string;
  };
}
