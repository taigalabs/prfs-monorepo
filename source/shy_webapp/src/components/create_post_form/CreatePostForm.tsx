import React from "react";
import { useRouter } from "next/navigation";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

import styles from "./CreatePostForm.module.scss";
import { paths } from "@/paths";
import TextEditor from "@/components/text_editor/TextEditor";
import { useI18N } from "@/i18n/hook";

const CreatePostForm: React.FC<CreatePostFormProps> = ({ channel }) => {
  const i18n = useI18N();
  const router = useRouter();
  const handleClickPost = React.useCallback(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{i18n.create_a_post}</div>
      <div className={styles.titleInput}>
        <input type="text" placeholder={i18n.what_is_this_discussion_about_in_one_sentence} />
      </div>
      <div className={styles.editorWrapper}>
        <TextEditor handleClickPost={handleClickPost} />
      </div>
      <div className={styles.btnRow}>btn</div>
    </div>
  );
};

export default CreatePostForm;

export interface CreatePostFormProps {
  channel: ShyChannel;
}
