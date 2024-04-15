import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import { ShyPost } from "@taigalabs/shy-entities/bindings/ShyPost";
import { Dayjs } from "dayjs";

import styles from "./PostRow.module.scss";
import Post from "@/components/post/Post";

const PostRow: React.FC<RowProps> = ({ post, channel, handleSucceedPost, subChannelId }) => {
  const author_proof_identity_inputs = React.useMemo(
    () => post.inner.author_proof_identity_inputs.join(", "),
    [post],
  );

  return (
    <Post
      topicId={post.inner.topic_id}
      channel={channel}
      author_public_key={post.inner.author_public_key}
      content={post.inner.content}
      author_proof_identity_inputs={author_proof_identity_inputs}
      updated_at={post.updated_at}
      handleSucceedPost={handleSucceedPost}
      subChannelId={subChannelId}
    />
  );
};

export default PostRow;

export interface RowProps {
  post: DateTimed<ShyPost>;
  now: Dayjs;
  channel: ShyChannel;
  handleSucceedPost: React.DispatchWithoutAction;
  subChannelId: string;
}
