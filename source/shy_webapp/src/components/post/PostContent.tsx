import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import Link from "next/link";

import styles from "./PostContent.module.scss";
import { paths } from "@/paths";

const PostContent: React.FC<PostContentProps> = ({ postId }) => {
  return <div>33</div>;
};

export default PostContent;

export interface PostContentProps {
  postId: string;
}
