import React from "react";
import { useCurrentEditor } from "@tiptap/react";

import styles from "./CreatePostEditorFooter.module.scss";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";

const CreatePostEditorFooter: React.FC<EditorFooterProps> = ({ handleClickCancel }) => {
  const i18n = useI18N();
  const { editor } = useCurrentEditor();

  return (
    <ul className={styles.wrapper}>
      <li>
        <Button variant="transparent_1" handleClick={handleClickCancel}>
          {i18n.cancel}
        </Button>
      </li>
      <li>
        <Button variant="green_1">{i18n.reply}</Button>
      </li>
    </ul>
  );
};

export default CreatePostEditorFooter;

export interface EditorFooterProps {
  handleClickCancel: () => void;
}
