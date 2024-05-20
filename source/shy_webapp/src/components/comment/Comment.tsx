import React from "react";
import dayjs from "dayjs";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { useRouter } from "next/navigation";
import { Proof } from "@taigalabs/prfs-driver-interface";

import styles from "./Comment.module.scss";
import { CommentWrapper, CommentInner } from "./CommentComponents";
import ContentMarkdown from "@/components/content_markdown/ContentMarkdown";
import CommentMenu from "./CommentMenu";
import CreateComment from "@/components/create_comment/CreateComment";
import { toShortDate } from "@/utils/time";
import ProofImage from "@/components/proof_image/ProofImage";
import AuthorAvatar from "../author/AuthorAvatar";
import { ShyCommentWithProofs } from "@taigalabs/shy-entities/bindings/ShyCommentWithProofs";
import ProofDialog from "../proof_dialog/ProofDialog";
import AuthorLabel from "../author/AuthorLabel";

const Comment: React.FC<PostContentProps> = ({
  topicId,
  channel,
  // author_public_key,
  // imgUrl,
  // expression,
  // content,
  // author_proof_ids,
  // author_proof_identity_inputs,
  // updated_at,
  subChannelId,
  handleSucceedPost,
  shy_comment_with_proofs,
  // proof,
  // proof_type_id,
}) => {
  const i18n = usePrfsI18N();
  const [isCommentActive, setIsCommentActive] = React.useState(false);
  const router = useRouter();

  const handleOpenComment = React.useCallback(() => {
    setIsCommentActive(true);
  }, [setIsCommentActive]);

  const handleClickCancel = React.useCallback(() => {
    setIsCommentActive(false);
  }, [setIsCommentActive]);

  const handleSucceedPostExtended = React.useCallback(() => {
    setIsCommentActive(false);

    if (handleSucceedPost) {
      handleSucceedPost();
    }
    // router.push(`${paths.c}/${channel.channel_id}/${pathParts.t}/${topicId}`);
  }, [handleSucceedPost, setIsCommentActive, router]);

  const shy_comment = shy_comment_with_proofs.shy_comment;

  const publicKeyAbbrev = React.useMemo(() => {
    return shy_comment.inner.author_public_key.substring(0, 8) || "";
  }, [shy_comment]);

  const date = React.useMemo(() => {
    const now = dayjs();
    return toShortDate(shy_comment.updated_at, now);
  }, [shy_comment]);

  const proofIdentities = React.useMemo(() => {
    const elems = shy_comment_with_proofs.shy_proofs.map(proof => {
      return <ProofDialog key={proof.shy_proof_id} proof={proof} />;
    });

    return <div>{elems}</div>;
  }, [shy_comment_with_proofs]);

  return (
    <CommentWrapper>
      <CommentInner>
        <div className={styles.header}>
          <div className={styles.left}>
            <div className={styles.item}>
              <AuthorAvatar publicKey={shy_comment.inner.author_public_key} />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.row}>
              <p className={styles.publicKey}>{publicKeyAbbrev}</p>
              <p className={styles.date}>{date}</p>
            </div>
            <div className={styles.row}>
              <button className={styles.proofIdentities} type="button">
                <div>{proofIdentities ?? i18n.proofs}</div>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <ContentMarkdown html={shy_comment.inner.content} />
        </div>
        <CommentMenu content={shy_comment.inner.content} handleClickReply={handleOpenComment} />
        {isCommentActive && (
          <CreateComment
            isActive={true}
            handleOpenComment={handleOpenComment}
            handleClickCancel={handleClickCancel}
            channel={channel}
            topicId={topicId}
            handleSucceedPost={handleSucceedPostExtended}
            subChannelId={subChannelId}
          />
        )}
      </CommentInner>
    </CommentWrapper>
  );
};

export default Comment;

export interface PostContentProps {
  shy_comment_with_proofs: ShyCommentWithProofs;
  // author_public_key: string;
  // author_proof_ids: string[];
  // content: string;
  // updated_at: string;
  channel: ShyChannel;
  topicId: string;
  handleSucceedPost: React.DispatchWithoutAction;
  subChannelId: string;
  // author_proof_identity_inputs: string;
  // imgUrl: string;
  // expression: string;
  // proof: Proof;
  // proof_type_id: string;
}
