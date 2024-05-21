import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { ShyCommentWithProofs } from "@taigalabs/shy-entities/bindings/ShyCommentWithProofs";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import { Dayjs } from "dayjs";
import { Proof } from "@taigalabs/prfs-driver-interface";

import styles from "./CommentRow.module.scss";
import Comment from "@/components/comment/Comment";

const CommentRow: React.FC<RowProps> = ({ comment, channel, handleSucceedPost, subChannelId }) => {
  const shy_comment = comment.shy_comment;

  return (
    <Comment
      topicId={shy_comment.inner.topic_id}
      channel={channel}
      handleSucceedPost={handleSucceedPost}
      subChannelId={subChannelId}
      shy_comment_with_proofs={comment}
    />
  );
};

export default CommentRow;

export interface RowProps {
  comment: ShyCommentWithProofs;
  now: Dayjs;
  channel: ShyChannel;
  handleSucceedPost: React.DispatchWithoutAction;
  subChannelId: string;
}
