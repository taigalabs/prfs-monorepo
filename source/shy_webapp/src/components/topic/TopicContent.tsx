import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { MdGroup } from "@react-icons/all-files/md/MdGroup";

import styles from "./TopicContent.module.scss";
import Post from "@/components/post/Post";
import Loading from "@/components/loading/Loading";

const TopicContent: React.FC<PostContentProps> = ({ topicId, channel, rerender, subChannelId }) => {
  const i18n = usePrfsI18N();
  const { data: postData, isFetching: postDataIsFetching } = useQuery({
    queryKey: ["get_shy_topic", topicId],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_topic", topic_id: topicId });
    },
  });

  const topic = postData?.payload?.shy_topic;
  const participant_identity_inputs = topic?.inner.participant_identity_inputs.join(",");
  const author_proof_identity_inputs = topic?.inner.author_proof_identity_inputs.join(",");

  return (
    <div className={styles.wrapper}>
      {topic ? (
        <>
          <div className={styles.titleRow}>
            <div className={styles.inner}>
              <p className={styles.title}>{topic.inner.title}</p>
              <div className={styles.postMeta}>
                <button className={styles.participants} type="button">
                  <MdGroup />
                  <span>{participant_identity_inputs ?? i18n.participants}</span>
                </button>
              </div>
            </div>
          </div>
          <Post
            topicId={topicId}
            channel={channel}
            author_public_key={topic.inner.author_public_key}
            author_proof_identity_inputs={author_proof_identity_inputs!}
            content={topic.inner.content}
            updated_at={topic.updated_at}
            handleSucceedPost={rerender}
            subChannelId={subChannelId}
          />
        </>
      ) : (
        <Loading centerAlign>
          <Spinner />
        </Loading>
      )}
    </div>
  );
};

export default TopicContent;

export interface PostContentProps {
  topicId: string;
  channel: ShyChannel;
  rerender: React.DispatchWithoutAction;
  subChannelId: string;
}
