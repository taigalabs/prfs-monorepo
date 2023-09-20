import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import TimelineFeeds2 from "@/components/timeline_feeds2/TimelineFeeds2";
import {
  ContentMainCenter,
  ContentMainInfiniteScroll,
  ContentMainRight,
} from "@/components/content_area/ContentArea";

import styles from "./CreatePostForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const CreatePostForm: React.FC<CreatePostFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <ContentMainInfiniteScroll>
        <ContentMainCenter>123123123</ContentMainCenter>
        <ContentMainRight>123</ContentMainRight>
      </ContentMainInfiniteScroll>
    </div>
  );
};

export default CreatePostForm;

export interface CreatePostFormProps {}
