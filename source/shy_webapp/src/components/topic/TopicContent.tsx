import React from "react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Link from "next/link";
import dayjs from "dayjs";
import { MdGroup } from "@react-icons/all-files/md/MdGroup";

import styles from "./TopicContent.module.scss";
import { useI18N } from "@/i18n/hook";
import Post from "@/components/post/Post";

const TopicContent: React.FC<PostContentProps> = ({ topicId }) => {
  const i18n = useI18N();
  const { data: postData, isFetching: postDataIsFetching } = useQuery({
    queryKey: ["get_shy_topic", topicId],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_topic", topic_id: topicId });
    },
  });
  const topic = postData?.payload?.shy_topic_syn1;
  // topic?.inner.shy_topic.topic_id

  return (
    <div className={styles.wrapper}>
      {topic ? (
        <>
          <div className={styles.titleRow}>
            <p className={styles.title}>{topic.inner.shy_topic.title}</p>
            <div className={styles.postMeta}>
              <button className={styles.participants} type="button">
                <MdGroup />
                <span>{i18n.participants}</span>
              </button>
            </div>
          </div>
          <Post
            author_public_key={topic.inner.shy_topic.author_public_key}
            content={topic.inner.shy_topic.content}
            proof_identity_input={topic.inner.proof_identity_input}
            updated_at={topic.updated_at}
          />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default TopicContent;

export interface PostContentProps {
  topicId: string;
}
