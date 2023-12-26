import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import TimelineFeeds2 from "@/components/timeline_feeds2/TimelineFeeds2";
import {
  ContentMainCenter,
  ContentMainInfiniteScroll,
  ContentMainRight,
  ContentMainTitle,
} from "@/components/content_area/ContentArea";
import Link from "next/link";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./CreatePostFormHeader.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const CreatePostFormHeader: React.FC<CreatePostFormHeaderProps> = ({ channelId }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <ContentMainTitle>
        {i18n.create_post} for {channelId}
      </ContentMainTitle>
      <div className={styles.btnRow}>
        <Link href={`${paths.c}/${channelId}?post`}>
          <Button variant="white_black_1">{i18n.submit}</Button>
        </Link>
      </div>
    </div>
  );
};

export default CreatePostFormHeader;

export interface CreatePostFormHeaderProps {
  channelId: string;
}
