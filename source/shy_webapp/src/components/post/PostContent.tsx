import React from "react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Link from "next/link";
import dayjs from "dayjs";
import { MdGroup } from "@react-icons/all-files/md/MdGroup";

import styles from "./PostContent.module.scss";
import { paths } from "@/paths";
import { toShortDate } from "@/utils/time";
import { PostInner } from "./PostComponent";
import PostMenu from "./PostMenu";
import { useI18N } from "@/i18n/hook";

const PostContent: React.FC<PostContentProps> = ({ postId }) => {
  const i18n = useI18N();
  const { data: postData, isFetching: postDataIsFetching } = useQuery({
    queryKey: ["get_shy_post", postId],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_post", post_id: postId });
    },
  });
  const post = postData?.payload?.shy_post;

  const publicKey = React.useMemo(() => {
    return post?.inner.public_key.substring(0, 10) || "";
  }, [post?.inner.public_key]);

  const date = React.useMemo(() => {
    if (post?.updated_at) {
      const now = dayjs();
      return toShortDate(post?.updated_at, now);
    } else return "";
  }, [post?.updated_at]);

  return (
    <div className={styles.wrapper}>
      {post ? (
        <>
          <div className={styles.titleRow}>
            <p className={styles.title}>{post.inner.title}</p>
            <div>
              <div className={styles.participants}>
                <MdGroup />
                <span>{i18n.participants}</span>
              </div>
            </div>
          </div>
          <PostInner>
            <div className={styles.meta}>
              <div className={styles.left}>
                <div className={styles.item}>
                  <p className={styles.publicKey}>{publicKey}</p>
                </div>
                <div className={styles.item}>
                  <p className={styles.proofIdentityInput}>{post.inner.proof_identity_input}</p>
                </div>
              </div>
              <div className={styles.right}>
                <p className={styles.date}>{date}</p>
              </div>
            </div>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: post.inner.content,
              }}
            />
            <PostMenu postId={postId} />
          </PostInner>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default PostContent;

export interface PostContentProps {
  postId: string;
}
