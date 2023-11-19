import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import TimelineFeeds2 from "@/components/timeline_feeds2/TimelineFeeds2";
import {
  ContentMainBody,
  ContentMainCenter,
  ContentMainHeader,
  ContentMainInfiniteScroll,
  ContentMainRight,
  ContentMainTitle,
} from "@/components/content_area/ContentArea";

import styles from "./CreatePostForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import RightBar from "@/components/right_bar/RightBar";
import CreatePostFormHeader from "./CreatePostFormHeader";
import TextEditor from "@/components/text_editor/TextEditor";

const CreatePostForm: React.FC<CreatePostFormProps> = ({ channelId }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <ContentMainInfiniteScroll>
        <ContentMainCenter>
          <ContentMainHeader style={{ height: 65 }}>
            <ContentMainTitle>
              {i18n.create_post} for {channelId}
            </ContentMainTitle>
          </ContentMainHeader>
          <ContentMainBody style={{ paddingTop: 65 }}>
            <div className={styles.editorContainer}>
              <TextEditor />
            </div>
            <div className={styles.btnRow}>btn</div>
          </ContentMainBody>
        </ContentMainCenter>
        <ContentMainRight>
          <RightBar />
        </ContentMainRight>
      </ContentMainInfiniteScroll>
    </div>
  );
};

export default CreatePostForm;

export interface CreatePostFormProps {
  channelId: string;
}
