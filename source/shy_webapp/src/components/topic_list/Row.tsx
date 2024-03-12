import React from "react";
import { Dayjs } from "dayjs";
import cn from "classnames";
import { ShyTopicSyn1 } from "@taigalabs/shy-entities/bindings/ShyTopicSyn1";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import Link from "next/link";

import styles from "./Row.module.scss";
import { pathParts, paths } from "@/paths";
import { toShortDate } from "@/utils/time";

const Row: React.FC<RowProps> = ({ topic, now, channelId }) => {
  const date = React.useMemo(() => {
    return toShortDate(topic.updated_at, now);
  }, [topic.updated_at]);

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={cn(styles.title, styles.col)}>
          <Link href={`${paths.c}/${channelId}/${pathParts.t}/${topic.inner.shy_topic.topic_id}`}>
            {topic.inner.shy_topic.title}
          </Link>
        </div>
        <div></div>
      </div>
      <div className={styles.meta}>
        <div className={cn(styles.proofIdentity, styles.col)}>
          {topic.inner.proof_identity_input}
        </div>
        <div className={cn(styles.col)}>{date}</div>
        <div className={cn(styles.totalReplyCount, styles.col)}>
          {topic.inner.shy_topic.total_reply_count}
        </div>
      </div>
    </div>
  );
};

export default Row;

export interface RowProps {
  topic: DateTimed<ShyTopicSyn1>;
  now: Dayjs;
  channelId: string;
}
