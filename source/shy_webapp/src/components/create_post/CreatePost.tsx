import React from "react";

import styles from "./CreatePost.module.scss";
import TextEditor from "@/components/text_editor/TextEditor";
import { useI18N } from "@/i18n/hook";
import CreatePostEditorFooter from "./CreatePostEditorFooter";

const CreatePost: React.FC<CreatePostProps> = ({ handleClickCancel }) => {
  const i18n = useI18N();

  const footer = React.useMemo(() => {
    return <CreatePostEditorFooter handleClickCancel={handleClickCancel} />;
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <TextEditor footer={footer} />
      </div>
    </div>
  );
};

export default CreatePost;

export interface CreatePostProps {
  handleClickCancel: () => void;
}
