import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Link from "next/link";

import styles from "./PostContent.module.scss";
import { paths } from "@/paths";

const PostContent: React.FC<PostContentProps> = ({ postId }) => {
  const { data: postData, isFetching: postDataIsFetching } = useQuery({
    queryKey: ["get_shy_post", postId],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_post", post_id: postId });
    },
  });
  const post = postData?.payload?.shy_post;

  return <div className={styles.wrapper}>{post ? <div>pow</div> : <Spinner />}</div>;
};

export default PostContent;

export interface PostContentProps {
  postId: string;
}
