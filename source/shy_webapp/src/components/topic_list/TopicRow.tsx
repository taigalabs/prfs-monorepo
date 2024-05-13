import React from "react";
import { Dayjs } from "dayjs";
import cn from "classnames";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import { FaReply } from "@react-icons/all-files/fa/FaReply";
import { ShyTopicWithProofs } from "@taigalabs/shy-entities/bindings/ShyTopicWithProofs";
import Link from "next/link";

import styles from "./TopicRow.module.scss";
import { pathParts, paths } from "@/paths";
import { toShortDate } from "@/utils/time";

const TopicRow: React.FC<RowProps> = ({ shy_topic_with_proofs, now, channelId }) => {
  const date = React.useMemo(() => {
    return toShortDate(shy_topic_with_proofs.shy_topic.updated_at, now);
  }, [shy_topic_with_proofs]);

  // const author_proof_identity_inputs =
  //   topic.inner.shy_topic?.author_proof_identity_inputs.join(", ");

  const shy_topic = shy_topic_with_proofs.shy_topic;

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={cn(styles.title, styles.col)}>
          <Link href={`${paths.c}/${channelId}/${pathParts.t}/${shy_topic.inner.topic_id}`}>
            {shy_topic.inner.title}
          </Link>
        </div>
        <div></div>
      </div>
      <div className={styles.meta}>
        <div className={styles.left}>
          {/* <div className={cn(styles.proofIdentity, styles.col)}>{author_proof_identity_inputs}</div> */}
          <div className={cn(styles.totalReplyCount, styles.col)}>
            <FaReply />
            <span>{shy_topic.inner.total_reply_count}</span>
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
  shy_topic_with_proofs: ShyTopicWithProofs;
  now: Dayjs;
  channelId: string;
}
