import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ContentMainBody,
  ContentMainCenter,
  ContentMainHeader,
  ContentMainInfiniteScroll,
  ContentMainRight,
} from "@/components/content_area/ContentArea";
import { ShyPost } from "@taigalabs/prfs-entities/bindings/ShyPost";
import RightBar from "@/components/right_bar/RightBar";

import styles from "./Row.module.scss";

async function fetchServerPage(
  limit: number,
  offset: number = 0,
): Promise<{ rows: string[]; nextOffset: number | undefined }> {
  console.log("fetch", limit, offset);

  const rows = new Array(limit).fill(0).map((e, i) => `Async loaded row #${i + offset * limit}`);

  await new Promise(r => setTimeout(r, 500));

  return {
    rows,
    // nextOffset: offset + 1
    nextOffset: undefined,
  };
}

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