import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { IoClose } from "@react-icons/all-files/io5/IoClose";

import styles from "./ErrorDialog.module.scss";
import Button from "@/components/button/Button";

const ErrorDialog: React.FC<EditorFooterProps> = ({ error, handleClickClose }) => {
  const i18n = usePrfsI18N();
  const { editor } = useCurrentEditor();

  // const extendedHandleClickReply = React.useCallback(() => {
  //   if (!editor) {
  //     return null;
  //   }

  //   const html = editor.getHTML();
  //   handleClickReply(html);
  // }, [handleClickReply, editor]);

  return (
    <div className={styles.wrapper}>
      <p>{error.toString()}</p>
      <button className={styles.closeBtn} onClick={handleClickClose}>
        <IoClose />
      </button>
    </div>
  );
};

export default ErrorDialog;

export interface EditorFooterProps {
  error: string;
  handleClickClose: () => void;
}
