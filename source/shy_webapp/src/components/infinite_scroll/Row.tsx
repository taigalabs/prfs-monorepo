import React from "react";
import { ShyPost } from "@taigalabs/shy-entities/bindings/ShyPost";

import styles from "./Row.module.scss";

const Row: React.FC<RowProps> = ({ post }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.author}>Anon says</div>
      <div
        className={styles.body}
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      />
    </div>
  );
};

export default Row;

export interface RowProps {
  post: ShyPost;
}
