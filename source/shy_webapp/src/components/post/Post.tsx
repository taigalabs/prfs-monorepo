import React from "react";
import dayjs from "dayjs";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { useRerender } from "@taigalabs/prfs-react-lib/src/hooks/use_rerender";

import styles from "./Post.module.scss";
import { paths } from "@/paths";
import { toShortDate } from "@/utils/time";
import { PostInner } from "./PostComponent";
import PostMenu from "./PostMenu";
import { useI18N } from "@/i18n/hook";
import CreatePost from "@/components/create_post/CreatePost";

const Post: React.FC<PostContentProps> = ({
  topicId,
  channel,
  author_public_key,
  content,
  proof_identity_input,
  updated_at,
}) => {
  const i18n = useI18N();
  const [isReplyOpen, setIsReplyOpen] = React.useState(false);
  const { rerender } = useRerender();

  const handleClickReply = React.useCallback(() => {
    setIsReplyOpen(true);
  }, [setIsReplyOpen]);
  const handleClickCancel = React.useCallback(() => {
    setIsReplyOpen(false);
  }, [setIsReplyOpen]);
  const handleSucceedPost = React.useCallback(() => {
    setIsReplyOpen(false);
    rerender();
  }, [rerender, setIsReplyOpen]);

  const publicKey = React.useMemo(() => {
    return author_public_key.substring(0, 8) || "";
  }, [author_public_key]);

  const date = React.useMemo(() => {
    const now = dayjs();
    return toShortDate(updated_at, now);
  }, [updated_at]);

  return (
    <PostInner>
      <div className={styles.meta}>
        <div className={styles.left}>
          <div className={styles.item}>
            <p className={styles.publicKey}>{publicKey}</p>
          </div>
          <div className={styles.item}>
            <p className={styles.proofIdentityInput}>{proof_identity_input}</p>
          </div>
        </div>
        <div className={styles.right}>
          <p className={styles.date}>{date}</p>
        </div>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      <PostMenu
        content={content}
        originalPostAuthorPubkey={publicKey}
        handleClickReply={handleClickReply}
      />
      {isReplyOpen && (
        <CreatePost
          handleClickCancel={handleClickCancel}
          channel={channel}
          topicId={topicId}
          handleSucceedPost={handleSucceedPost}
        />
      )}
    </PostInner>
  );
};

export default Post;

export interface PostContentProps {
  author_public_key: string;
  proof_identity_input: string;
  content: string;
  updated_at: string;
  channel: ShyChannel;
  topicId: string;
}
