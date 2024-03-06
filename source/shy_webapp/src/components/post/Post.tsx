import React from "react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Link from "next/link";
import dayjs from "dayjs";
import { MdGroup } from "@react-icons/all-files/md/MdGroup";

import styles from "./Post.module.scss";
import { paths } from "@/paths";
import { toShortDate } from "@/utils/time";
import { PostInner } from "./PostComponent";
import PostMenu from "./PostMenu";
import { useI18N } from "@/i18n/hook";

const Post: React.FC<PostContentProps> = ({
  author_public_key,
  content,
  proof_identity_input,
  updated_at,
}) => {
  const i18n = useI18N();
  // const { data: postData, isFetching: postDataIsFetching } = useQuery({
  //   queryKey: ["get_shy_topic", topicId],
  //   queryFn: async () => {
  //     return shyApi2({ type: "get_shy_topic", topic_id: topicId });
  //   },
  // });
  // const topic = postData?.payload?.shy_topic_syn1;

  const publicKey = React.useMemo(() => {
    return author_public_key.substring(0, 10) || "";
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
      <PostMenu content={content} originalPostAuthorPubkey={publicKey} />
    </PostInner>
  );
};

export default Post;

export interface PostContentProps {
  author_public_key: string;
  proof_identity_input: string;
  content: string;
  updated_at: string;
}
