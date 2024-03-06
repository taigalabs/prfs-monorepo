import React from "react";
import { useCurrentEditor } from "@tiptap/react";

import styles from "./EditorFooter.module.scss";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";

const EditorFooter: React.FC<EditorFooterProps> = ({ handleClickPost }) => {
  const i18n = useI18N();
  const { editor } = useCurrentEditor();

  const extendedHandleClickPost = React.useCallback(() => {
    if (!editor) {
      return null;
    }

    const html = editor.getHTML();
    handleClickPost(html);
  }, [handleClickPost, editor]);

  return (
    <div className={styles.wrapper}>
      <Button variant="green_1" handleClick={extendedHandleClickPost}>
        {i18n.prove_and_post}
      </Button>
    </div>
  );
};

export default EditorFooter;

export interface EditorFooterProps {
  handleClickPost: (html: string) => void;
}
