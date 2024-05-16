import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./CreatePostEditorFooter.module.scss";
import Button from "@/components/button/Button";

const CreatePostEditorFooter: React.FC<EditorFooterProps> = ({
  handleClickCancel,
  handleClickReply,
}) => {
  const i18n = usePrfsI18N();

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        <li>
          <Button variant="transparent_1" handleClick={handleClickCancel} className={styles.button}>
            {i18n.cancel}
          </Button>
        </li>
      </ul>
      <ul className={styles.list}>
        <li>
          <Button variant="transparent_1" handleClick={handleClickCancel} className={styles.button}>
            {i18n.cancel}
          </Button>
        </li>
        <li>
          <Button variant="green_1" handleClick={handleClickReply} className={styles.button}>
            {i18n.reply}
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default CreatePostEditorFooter;

export interface EditorFooterProps {
  handleClickCancel: () => void;
  handleClickReply: () => void;
}
