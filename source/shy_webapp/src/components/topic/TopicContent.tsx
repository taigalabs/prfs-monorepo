import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { FaRegArrowAltCircleUp } from "@react-icons/all-files/fa/FaRegArrowAltCircleUp";
import { FaRegCommentAlt } from "@react-icons/all-files/fa/FaRegCommentAlt";

import styles from "./TopicContent.module.scss";
import Loading from "@/components/loading/Loading";
import ContentMarkdown from "@/components/content_markdown/ContentMarkdown";
import AuthorLabel from "@/components/author/AuthorLabel";
import AuthorAvatar from "@/components/author/AuthorAvatar";
import ProofDialog from "@/components/proof_dialog/ProofDialog";
import ProofImage from "@/components/proof_image/ProofImage";
import CreateComment from "@/components/create_comment/CreateComment";

const TopicContent: React.FC<PostContentProps> = ({ topicId, channel, rerender, subChannelId }) => {
  const i18n = usePrfsI18N();
  const [isActive, setIsActive] = React.useState(false);

  const handleClickCancel = React.useCallback(() => {
    setIsActive(false);
  }, [setIsActive]);

  const handleOpenComment = React.useCallback(() => {
    setIsActive(true);
  }, [setIsActive]);

  const { data: postData, isFetching: postDataIsFetching } = useQuery({
    queryKey: ["get_shy_topic", topicId],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_topic", topic_id: topicId });
    },
  });

  const shy_topic_with_proofs = postData?.payload?.shy_topic_with_proofs;

  const proofIdentities = React.useMemo(() => {
    if (shy_topic_with_proofs) {
      const elems = shy_topic_with_proofs.shy_proofs.map(proof => {
        return <ProofDialog key={proof.shy_proof_id} proof={proof} />;
      });

      return <div>{elems}</div>;
    } else return null;
  }, [shy_topic_with_proofs]);

  return (
    <div className={styles.wrapper}>
      {shy_topic_with_proofs ? (
        <>
          <div className={styles.header}>
            <div className={styles.postMeta}>
              <div className={styles.left}>
                <AuthorAvatar publicKey={shy_topic_with_proofs.shy_topic.inner.author_public_key} />
              </div>
              <div>
                <AuthorLabel publicKey={shy_topic_with_proofs.shy_topic.inner.author_public_key} />
                <button className={styles.proofIdentities} type="button">
                  <div>{proofIdentities ?? i18n.proofs}</div>
                </button>
              </div>
            </div>
            <p className={styles.title}>{shy_topic_with_proofs.shy_topic.inner.title}</p>
          </div>
          <div className={styles.body}>
            <ContentMarkdown html={shy_topic_with_proofs.shy_topic.inner.content} />
          </div>
          <div className={styles.topicMenu}>
            <button type="button" className={styles.button}>
              <FaRegArrowAltCircleUp />
              <span>0</span>
            </button>
            <button type="button" className={styles.button}>
              <FaRegCommentAlt />
              <span>0</span>
            </button>
          </div>
          <div className={styles.comment}>
            <CreateComment
              isActive={isActive}
              handleOpenComment={handleOpenComment}
              handleClickCancel={handleClickCancel}
              channel={channel}
              topicId={topicId}
              handleSucceedPost={() => {}}
              subChannelId={subChannelId}
            />
          </div>
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
