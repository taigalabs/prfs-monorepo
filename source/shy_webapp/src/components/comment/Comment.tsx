import React from "react";
import dayjs from "dayjs";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { useRouter } from "next/navigation";
import { ShyCommentWithProofs } from "@taigalabs/shy-entities/bindings/ShyCommentWithProofs";

import styles from "./Comment.module.scss";
import { CommentWrapper, CommentInner } from "./CommentComponents";
import ContentMarkdown from "@/components/content_markdown/ContentMarkdown";
import CommentMenu from "./CommentMenu";
import CreateComment from "@/components/create_comment/CreateComment";
import { toShortDate } from "@/utils/time";
import AuthorAvatar from "@/components/author/AuthorAvatar";
import ProofDialog from "@/components/proof_dialog/ProofDialog";

const Comment: React.FC<PostContentProps> = ({
  topicId,
  channel,
  subChannelId,
  handleSucceedPost,
  shy_comment_with_proofs,
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
            <div className={styles.avatar}>
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
            <div className={styles.body}>
              <ContentMarkdown html={shy_comment.inner.content} />
            </div>
            <CommentMenu content={shy_comment.inner.content} handleClickReply={handleOpenComment} />
            {isCommentActive && (
              <div className={styles.comment}>
                <CreateComment
                  isActive={true}
                  handleOpenComment={handleOpenComment}
                  handleClickCancel={handleClickCancel}
                  channel={channel}
                  topicId={topicId}
                  handleSucceedPost={handleSucceedPostExtended}
                  subChannelId={subChannelId}
                />
              </div>
            )}
          </div>
        </div>
      </CommentInner>
    </CommentWrapper>
  );
};

export default Comment;

export interface PostContentProps {
  shy_comment_with_proofs: ShyCommentWithProofs;
  channel: ShyChannel;
  topicId: string;
  handleSucceedPost: React.DispatchWithoutAction;
  subChannelId: string;
}
