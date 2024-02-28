import React from "react";
import { ShyPost } from "@taigalabs/shy-entities/bindings/ShyPost";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";

import styles from "./Row.module.scss";

const Row: React.FC<RowProps> = ({ post }) => {
  console.log(22, post);
  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.author}>{post.inner.title}</div>
        <div></div>
      </div>
      <div>
        <div>{post.inner.proof_identity_input}</div>
      </div>
      {/* <div */}
      {/*   className={styles.body} */}
      {/*   dangerouslySetInnerHTML={{ */}
      {/*     __html: post.content, */}
      {/*   }} */}
      {/* /> */}
    </div>
  );
};

export default Row;

export interface RowProps {
  post: DateTimed<ShyPost>;
}
