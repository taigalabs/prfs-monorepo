import React from "react";
import { useRouter } from "next/navigation";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

import styles from "./CreatePostForm.module.scss";
import { paths } from "@/paths";
import { useI18N } from "@/i18n/hook";
import { envs } from "@/envs";
import { useCurrentEditor } from "@tiptap/react";
import Button from "@/components/button/Button";

const EditorFooter: React.FC<EditorFooterProps> = ({ handleClickPost }) => {
  const i18n = useI18N();
  const { editor } = useCurrentEditor();
  const router = useRouter();

  const extendedHandleClickPost = React.useCallback(() => {
    if (!editor) {
      return null;
    }

    const html = editor.getHTML();
    handleClickPost(html);
  }, [handleClickPost, editor]);

  return (
    <div className={styles.footer}>
      <Button variant="green_1" handleClick={extendedHandleClickPost}>
        {i18n.post}
      </Button>
    </div>
  );
};

export default EditorFooter;

export interface EditorFooterProps {
  handleClickPost: (html: string) => void;
}
