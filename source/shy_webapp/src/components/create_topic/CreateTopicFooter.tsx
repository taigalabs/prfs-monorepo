import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./CreateTopicFooter.module.scss";
import Button from "@/components/button/Button";

const CreateTopicFooter: React.FC<EditorFooterProps> = ({ handleClickTopic, inProgress }) => {
  const i18n = usePrfsI18N();
  const { editor } = useCurrentEditor();

  const extendedHandleClickTopic = React.useCallback(() => {
    if (!editor) {
      return null;
    }

    const html = editor.getHTML();
    handleClickTopic(html);
  }, [handleClickTopic, editor]);

  return (
    <div className={styles.wrapper}>
      <Button variant="green_1" handleClick={extendedHandleClickTopic}>
        {inProgress ? <Spinner /> : i18n.prove_and_post}
      </Button>
    </div>
  );
};

export default CreateTopicFooter;

export interface EditorFooterProps {
  handleClickTopic: (html: string) => void;
  inProgress: boolean;
}
