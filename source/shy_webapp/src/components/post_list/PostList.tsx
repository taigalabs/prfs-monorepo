import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { MdGroup } from "@react-icons/all-files/md/MdGroup";

import styles from "./PostList.module.scss";
import Post from "@/components/post/Post";
import Loading from "@/components/loading/Loading";

const PostList: React.FC<PostList> = ({ topicId, channel }) => {
  const i18n = usePrfsI18N();
  // const { data: postsData, isFetching: postsDataIsFetching } = useQuery({
  //   queryKey: ["get_shy_posts_of_topic", topicId, channel.channel_id],
  //   queryFn: async () => {
  //     return shyApi2({
  //       type: "get_shy_posts_of_topic",
  //       topic_id: topicId,
  //       channel_id: channel.channel_id,
  //     });
  //   },
  // });
  // const posts = postsData?.payload?.shy_posts;

  // const listElem = React.useMemo(() => {
  //   if (posts) {
  //     posts.map(p => {
  //       return <div key={p.inner.shy_post.post_id}>{p.inner.proof_identity_input}</div>;
  //     });
  //   }
  //   return null;
  // }, [posts]);

  return (
    <div className={styles.wrapper}>
      {/* {listElem} */}
      {/* {topic ? ( */}
      {/*   <> */}
      {/*     <div className={styles.titleRow}> */}
      {/*       <p className={styles.title}>{topic.inner.shy_topic.title}</p> */}
      {/*       <div className={styles.postMeta}> */}
      {/*         <button className={styles.participants} type="button"> */}
      {/*           <MdGroup /> */}
      {/*           <span>{i18n.participants}</span> */}
      {/*         </button> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*     <Post */}
      {/*       topicId={topicId} */}
      {/*       channel={channel} */}
      {/*       author_public_key={topic.inner.shy_topic.author_public_key} */}
      {/*       content={topic.inner.shy_topic.content} */}
      {/*       proof_identity_input={topic.inner.proof_identity_input} */}
      {/*       updated_at={topic.updated_at} */}
      {/*     /> */}
      {/*   </> */}
      {/* ) : ( */}
      {/*   <Loading centerAlign> */}
      {/*     <Spinner /> */}
      {/*   </Loading> */}
      {/* )} */}
    </div>
  );
};

export default PostList;

export interface PostList {
  topicId: string;
  channel: ShyChannel;
}
