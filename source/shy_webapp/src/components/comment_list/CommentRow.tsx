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
  //
  const shy_comment = comment.shy_comment;

  return (
    <Comment
      topicId={shy_comment.inner.topic_id}
      channel={channel}
      // author_public_key={shy_comment.inner.author_public_key}
      // content={shy_comment.inner.content}
      // author_proof_ids={shy_comment.inner.author_proof_ids as string[]}
      // updated_at={shy_comment.updated_at}
      handleSucceedPost={handleSucceedPost}
      subChannelId={subChannelId}
      shy_comment_with_proofs={comment}

      // imgUrl={post.inner.img_url}
      // author_proof_identity_inputs={author_proof_identity_inputs}
      // expression={post.inner.expression}
      // proof={proof}
      // proof_type_id={post.inner.proof_type_id}
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
