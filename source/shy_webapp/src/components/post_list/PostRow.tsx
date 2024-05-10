import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import { ShyPost } from "@taigalabs/shy-entities/bindings/ShyPost";
import { Dayjs } from "dayjs";

import styles from "./PostRow.module.scss";
import Post from "@/components/post/Post";
import { ShyPostSyn1 } from "@taigalabs/shy-entities/bindings/ShyPostSyn1";
import { Proof } from "@taigalabs/prfs-driver-interface";

const PostRow: React.FC<RowProps> = ({ post, channel, handleSucceedPost, subChannelId }) => {
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
    <Post
      topicId={post.inner.shy_post.topic_id}
      channel={channel}
      author_public_key={post.inner.shy_post.author_public_key}
      content={post.inner.shy_post.content}
      author_proof_ids={post.inner.shy_post.author_proof_ids as string[]}
      // author_proof_identity_inputs={author_proof_identity_inputs}
      updated_at={post.updated_at}
      handleSucceedPost={handleSucceedPost}
      subChannelId={subChannelId}
      imgUrl={post.inner.img_url}
      expression={post.inner.expression}
      // proof={proof}
      // proof_type_id={post.inner.proof_type_id}
    />
  );
};

export default PostRow;

export interface RowProps {
  post: DateTimed<ShyPostSyn1>;
  now: Dayjs;
  channel: ShyChannel;
  handleSucceedPost: React.DispatchWithoutAction;
  subChannelId: string;
}
