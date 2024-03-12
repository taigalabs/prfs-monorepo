import React from "react";
import dayjs from "dayjs";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { useRouter } from "next/navigation";

import styles from "./Post.module.scss";
import { toShortDate } from "@/utils/time";
import { PostWrapper, PostInner } from "./PostComponent";
import PostMenu from "./PostMenu";
import CreatePost from "@/components/create_post/CreatePost";

const Post: React.FC<PostContentProps> = ({
  topicId,
  channel,
  author_public_key,
  content,
  proof_identity_input,
  updated_at,
  rerender,
}) => {
  const i18n = usePrfsI18N();
  const [isReplyOpen, setIsReplyOpen] = React.useState(false);
  const router = useRouter();

  const handleClickReply = React.useCallback(() => {
    setIsReplyOpen(true);
  }, [setIsReplyOpen]);
  const handleClickCancel = React.useCallback(() => {
    setIsReplyOpen(false);
  }, [setIsReplyOpen]);
  const handleSucceedPost = React.useCallback(() => {
    setIsReplyOpen(false);

    if (rerender) {
      rerender();
    }
    // router.push(`${paths.c}/${channel.channel_id}/${pathParts.t}/${topicId}`);
  }, [rerender, setIsReplyOpen, router, rerender]);

  const publicKey = React.useMemo(() => {
    return author_public_key.substring(0, 8) || "";
  }, [author_public_key]);

  const date = React.useMemo(() => {
    const now = dayjs();
    return toShortDate(updated_at, now);
  }, [updated_at]);

  return (
    <PostWrapper>
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
    </PostWrapper>
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
  rerender?: React.DispatchWithoutAction;
}
