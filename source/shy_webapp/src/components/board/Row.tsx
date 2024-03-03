import React from "react";
import dayjs, { Dayjs } from "dayjs";
import cn from "classnames";
import { ShyPost } from "@taigalabs/shy-entities/bindings/ShyPost";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import Link from "next/link";

import styles from "./Row.module.scss";
import { paths } from "@/paths";
import { toShortDate } from "@/utils/time";

const Row: React.FC<RowProps> = ({ post, now, channelId }) => {
  const date = React.useMemo(() => {
    return toShortDate(post.updated_at, now);
  }, [post.updated_at]);

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={cn(styles.title, styles.col)}>
          <Link href={`${paths.c}/${channelId}/p/${post.inner.post_id}`}>{post.inner.title}</Link>
        </div>
        <div></div>
      </div>
      <div className={styles.meta}>
        <div className={cn(styles.proofIdentity, styles.col)}>
          {post.inner.proof_identity_input}
        </div>
        <div className={cn(styles.col)}>{date}</div>
        <div className={cn(styles.numReplies, styles.col)}>{post.inner.num_replies}</div>
      </div>
    </div>
  );
};

export default Row;

export interface RowProps {
  post: DateTimed<ShyPost>;
  now: Dayjs;
  channelId: string;
}
