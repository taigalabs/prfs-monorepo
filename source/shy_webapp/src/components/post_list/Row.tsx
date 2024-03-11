import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import { ShyPostSyn1 } from "@taigalabs/shy-entities/bindings/ShyPostSyn1";
import { Dayjs } from "dayjs";
import Link from "next/link";

import styles from "./Row.module.scss";
import { paths } from "@/paths";
import Post from "@/components/post/Post";

const Row: React.FC<RowProps> = ({ post, channel }) => {
  return (
    <div className={styles.wrapper}>
      <Post
        topicId={post.inner.shy_post.topic_id}
        channel={channel}
        author_public_key={post.inner.shy_post.author_public_key}
        content={post.inner.shy_post.content}
        proof_identity_input={post.inner.proof_identity_input}
        updated_at={post.updated_at}
      />
    </div>
  );
};

export default Row;

export interface RowProps {
  post: DateTimed<ShyPostSyn1>;
  now: Dayjs;
  channel: ShyChannel;
}
