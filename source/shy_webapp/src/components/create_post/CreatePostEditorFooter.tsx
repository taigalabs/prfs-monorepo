import React from "react";
import { useCurrentEditor } from "@tiptap/react";

import styles from "./CreatePostEditorFooter.module.scss";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";

const CreatePostEditorFooter: React.FC<EditorFooterProps> = ({
  handleClickCancel,
  handleClickReply,
}) => {
  const i18n = useI18N();
  const { editor } = useCurrentEditor();

  const extendedHandleClickReply = React.useCallback(() => {
    if (!editor) {
      return null;
    }

    const html = editor.getHTML();
    handleClickReply(html);
  }, [handleClickReply, editor]);

  return (
    <ul className={styles.wrapper}>
      <li>
        <Button variant="transparent_1" handleClick={handleClickCancel}>
          {i18n.cancel}
        </Button>
      </li>
      <li>
        <Button variant="green_1" handleClick={extendedHandleClickReply}>
          {i18n.reply}
        </Button>
      </li>
    </ul>
  );
};

export default CreatePostEditorFooter;

export interface EditorFooterProps {
  handleClickCancel: () => void;
  handleClickReply: (content: string) => void;
}
