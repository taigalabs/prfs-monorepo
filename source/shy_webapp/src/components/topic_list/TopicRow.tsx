import React from "react";
import { Dayjs } from "dayjs";
import cn from "classnames";
import { ShyTopicSyn1 } from "@taigalabs/shy-entities/bindings/ShyTopicSyn1";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import { FaReply } from "@react-icons/all-files/fa/FaReply";
import { ShyTopic } from "@taigalabs/shy-entities/bindings/ShyTopic";
import Link from "next/link";

import styles from "./TopicRow.module.scss";
import { pathParts, paths } from "@/paths";
import { toShortDate } from "@/utils/time";

const TopicRow: React.FC<RowProps> = ({ topic, now, channelId }) => {
  const date = React.useMemo(() => {
    return toShortDate(topic.updated_at, now);
  }, [topic.updated_at]);

  const author_proof_identity_inputs = topic.inner.author_proof_identity_inputs.join(",");

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={cn(styles.title, styles.col)}>
          <Link href={`${paths.c}/${channelId}/${pathParts.t}/${topic.inner.topic_id}`}>
            {topic.inner.title}
          </Link>
        </div>
        <div></div>
      </div>
      <div className={styles.meta}>
        <div className={styles.left}>
          <div className={cn(styles.proofIdentity, styles.col)}>{author_proof_identity_inputs}</div>
          <div className={cn(styles.totalReplyCount, styles.col)}>
            <FaReply />
            <span>{topic.inner.total_reply_count}</span>
          </div>
        </div>
        <div className={styles.right}>
          <div className={cn(styles.col)}>{date}</div>
        </div>
      </div>
    </div>
  );
};

export default TopicRow;

export interface RowProps {
  topic: DateTimed<ShyTopic>;
  now: Dayjs;
  channelId: string;
}
