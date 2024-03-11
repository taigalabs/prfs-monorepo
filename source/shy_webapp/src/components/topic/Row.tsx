import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import Link from "next/link";

import styles from "./Row.module.scss";
import { paths } from "@/paths";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import { ShyPostSyn1 } from "@taigalabs/shy-entities/bindings/ShyPostSyn1";

const Row: React.FC<RowProps> = ({ post }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        33
        {/* <span className={styles.label}>{post.inner.shy_post.}</span> */}
        {/* <span className={styles.locale}>{channel.locale}</span> */}
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: post.inner.shy_post.content,
        }}
      />
    </div>
  );
};

export default Row;

export interface RowProps {
  post: DateTimed<ShyPostSyn1>;
}
