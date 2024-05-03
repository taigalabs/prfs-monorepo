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
import { PostMarkdown } from "./PostMarkdown";
import ProofImage from "../proof_image/ProofImage";
import ProofDialog from "./ProofDialog";

const Post: React.FC<PostContentProps> = ({
  topicId,
  channel,
  author_public_key,
  imgUrl,
  expression,
  content,
  author_proof_identity_inputs,
  updated_at,
  subChannelId,
  handleSucceedPost,
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

  const handleSucceedPostExtended = React.useCallback(() => {
    setIsReplyOpen(false);

    if (handleSucceedPost) {
      handleSucceedPost();
    }
    // router.push(`${paths.c}/${channel.channel_id}/${pathParts.t}/${topicId}`);
  }, [handleSucceedPost, setIsReplyOpen, router]);

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
              <ProofDialog
                imgUrl={imgUrl}
                author_proof_identity_inputs={author_proof_identity_inputs}
              />
              {/* <div className={styles.proofIdentity}> */}
              {/*   <ProofImage className={styles.proofImage} imgUrl={imgUrl} /> */}
              {/*   <p className={styles.proofIdentityInput}>{author_proof_identity_inputs}</p> */}
              {/* </div> */}
            </div>
          </div>
          <div className={styles.right}>
            <p className={styles.date}>{date}</p>
          </div>
        </div>
        <div className={styles.content}>
          <PostMarkdown className={styles.content} html={content} />
        </div>
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
            handleSucceedPost={handleSucceedPostExtended}
            subChannelId={subChannelId}
          />
        )}
      </PostInner>
    </PostWrapper>
  );
};

export default Post;

export interface PostContentProps {
  author_public_key: string;
  author_proof_identity_inputs: string;
  content: string;
  updated_at: string;
  channel: ShyChannel;
  topicId: string;
  handleSucceedPost: React.DispatchWithoutAction;
  subChannelId: string;
  imgUrl: string;
  expression: string;
}
