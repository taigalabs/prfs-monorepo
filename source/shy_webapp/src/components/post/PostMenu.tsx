import React from "react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Link from "next/link";
import dayjs from "dayjs";

import styles from "./PostMenu.module.scss";
import { paths } from "@/paths";
import { toShortDate } from "@/utils/time";
import { PostInner } from "./PostComponent";

const PostMenu: React.FC<PostContentProps> = ({ postId }) => {
  // const { data: postData, isFetching: postDataIsFetching } = useQuery({
  //   queryKey: ["get_shy_post", postId],
  //   queryFn: async () => {
  //     return shyApi2({ type: "get_shy_post", post_id: postId });
  //   },
  // });
  // const post = postData?.payload?.shy_post;

  // const publicKey = React.useMemo(() => {
  //   return post?.inner.public_key.substring(0, 10) || "";
  // }, [post?.inner.public_key]);

  // const date = React.useMemo(() => {
  //   if (post?.updated_at) {
  //     const now = dayjs();
  //     return toShortDate(post?.updated_at, now);
  //   } else return "";
  // }, [post?.updated_at]);

  return <div className={styles.wrapper}>power</div>;
};

export default PostMenu;

export interface PostContentProps {
  postId: string;
}
