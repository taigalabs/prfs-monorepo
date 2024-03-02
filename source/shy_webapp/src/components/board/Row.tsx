import React from "react";
import dayjs, { Dayjs } from "dayjs";
import cn from "classnames";
import { ShyPost } from "@taigalabs/shy-entities/bindings/ShyPost";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";

import styles from "./Row.module.scss";
import Link from "next/link";
import { paths } from "@/paths";

const Row: React.FC<RowProps> = ({ post, now, channelId }) => {
  const date = React.useMemo(() => {
    const d = dayjs(post.updated_at);
    if (now.isSame(d, "day")) {
      return d.format("HH:mm");
    } else if (now.isSame(d, "year")) {
      return d.format("MM.DD");
    } else {
      return d.format("YY.MM.DD");
    }
  }, [post, now]);

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
      {/* <div */}
      {/*   className={styles.body} */}
      {/*   dangerouslySetInnerHTML={{ */}
      {/*     __html: post.content, */}
      {/*   }} */}
      {/* /> */}
    </div>
  );
};

export default Row;

export interface RowProps {
  post: DateTimed<ShyPost>;
  now: Dayjs;
  channelId: string;
}
