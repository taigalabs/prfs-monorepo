import React, { Suspense } from "react";

import styles from "./ChannelPage.module.scss";
import DefaultLayout, { DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import Channel from "@/components/channel/Channel";
import Post from "@/components/post/Post";

const PostPage: React.FC<ChannelPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <Suspense>
        <DefaultMain>
          <Post postId={params.post_id} channelId={params.channel_id} />
        </DefaultMain>
      </Suspense>
    </DefaultLayout>
  );
};

export default PostPage;

export interface ChannelPageProps {
  params: {
    post_id: string;
    channel_id: string;
  };
}
