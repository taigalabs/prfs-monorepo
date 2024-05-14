import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { ShyCommentWithProofs } from "@taigalabs/shy-entities/bindings/ShyCommentWithProofs";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import { Dayjs } from "dayjs";
import { Proof } from "@taigalabs/prfs-driver-interface";

import styles from "./CommentRow.module.scss";
import Comment from "@/components/comment/Comment";

const CommentRow: React.FC<RowProps> = ({ comment, channel, handleSucceedPost, subChannelId }) => {
  // const author_proof_identity_inputs = React.useMemo(
  //   () => post.inner.shy_post.author_proof_identity_inputs.join(", "),
  //   [post],
  // );

  // const proof = React.useMemo(() => {
  //   const proof: Proof = {
  //     proofBytes: post.inner.proof,
  //     publicInputSer: post.inner.public_inputs,
  //     proofPubKey: post.inner.proof_public_key,
  //   };
  //   return proof;
  // }, [post]);

  return (
    <Comment
      topicId={comment.inner.shy_comment.topic_id}
      channel={channel}
      author_public_key={comment.inner.shy_comment.author_public_key}
      content={comment.inner.shy_comment.content}
      author_proof_ids={comment.inner.shy_comment.author_proof_ids as string[]}
      // author_proof_identity_inputs={author_proof_identity_inputs}
      updated_at={comment.updated_at}
      handleSucceedPost={handleSucceedPost}
      subChannelId={subChannelId}
      // imgUrl={post.inner.img_url}
      // expression={post.inner.expression}
      // proof={proof}
      // proof_type_id={post.inner.proof_type_id}
    />
  );
};

export default CommentRow;

export interface RowProps {
  comment: DateTimed<ShyCommentWithProofs>;
  now: Dayjs;
  channel: ShyChannel;
  handleSucceedPost: React.DispatchWithoutAction;
  subChannelId: string;
}
