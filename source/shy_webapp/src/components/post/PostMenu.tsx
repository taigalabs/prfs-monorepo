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
  return <div className={styles.wrapper}>wip</div>;
};

export default PostMenu;

export interface PostContentProps {
  postId: string;
}
