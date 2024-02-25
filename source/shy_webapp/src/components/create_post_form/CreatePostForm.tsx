import React from "react";
import { useRouter } from "next/navigation";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

import styles from "./CreatePostForm.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import TextEditor from "@/components/text_editor/TextEditor";

const CreatePostForm: React.FC<CreatePostFormProps> = ({ channel }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <div>
        {i18n.code} for {channel.channel_id}
      </div>
      <div className={styles.editorContainer}>
        <TextEditor />
      </div>
      <div className={styles.btnRow}>btn</div>
    </div>
  );
};

export default CreatePostForm;

export interface CreatePostFormProps {
  channel: ShyChannel;
}
