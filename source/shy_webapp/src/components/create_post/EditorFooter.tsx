import React from "react";
import { useCurrentEditor } from "@tiptap/react";

import styles from "./EditorFooter.module.scss";
import { useI18N } from "@/i18n/hook";

const CreatePostEditorFooter: React.FC<EditorFooterProps> = ({}) => {
  const i18n = useI18N();
  const { editor } = useCurrentEditor();

  return (
    <ul className={styles.wrapper}>
      <li>{i18n.cancel}</li>
      <li>{i18n.reply}</li>
    </ul>
  );
};

export default CreatePostEditorFooter;

export interface EditorFooterProps {}
