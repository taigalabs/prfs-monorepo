import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { MdGroup } from "@react-icons/all-files/md/MdGroup";
import { Proof } from "@taigalabs/prfs-driver-interface";

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

  const shy_topic = postData?.payload?.shy_topic_syn1.shy_topic;
  const shy_proofs = postData?.payload?.shy_topic_syn1.shy_proofs;
  // const a  = postData?.payload?.shy_topic;
  // const participant_identity_inputs = React.useMemo(() => {
  //   if (topic) {
  //     const ids = topic?.inner.shy_topic.participant_proof_identities as ProofIdentity[];
  //     return ids.map(pid => {
  //       return pid.proof_identity_input;
  //     });
  //   }
  // }, [topic]);

  // const author_proof_identity_inputs = React.useMemo(() => {
  //   if (topic) {
  //     const ids = topic?.inner.shy_topic.author_proof_identities as ProofIdentity[];
  //     return ids.map(pid => {
  //       return pid.proof_identity_input;
  //     });
  //   }
  // }, [topic]);

  // const proof = React.useMemo(() => {
  //   if (topic) {
  //     const proof: Proof = {
  //       proofBytes: topic.inner.proof,
  //       publicInputSer: topic.inner.public_inputs,
  //       proofPubKey: topic.inner.proof_public_key,
  //     };
  //     return proof;
  //   }
  // }, [topic]);

  return (
    <div className={styles.wrapper}>
      {shy_topic && shy_proofs ? (
        <>
          <div className={styles.titleRow}>
            <div className={styles.inner}>
              <p className={styles.title}>{shy_topic.inner.title}</p>
              <div className={styles.postMeta}>
                <button className={styles.participants} type="button">
                  <MdGroup />
                  <span>
                    {shy_topic.inner.participant_proof_ids.join(", ") ?? i18n.participants}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <Post
            topicId={topicId}
            channel={channel}
            author_public_key={shy_topic.inner.author_public_key}
            author_proof_ids={shy_topic.inner.author_proof_ids}
            // author_proof_identity_inputs={author_proof_identity_inputs!}
            content={shy_topic.inner.content}
            updated_at={shy_topic.updated_at}
            handleSucceedPost={rerender}
            subChannelId={subChannelId}
            // imgUrl={shy_topic}
            // proofs={shy_proofs}
            // imgUrl={topic.inner.img_url}
            // expression={topic.inner.expression}
            // proof={proof}
            // proof_type_id={topic.inner.proof_type_id}
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
