import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";

import styles from "./CreateComment.module.scss";
import TextEditor from "@/components/text_editor/TextEditor";
import CreatePostEditorFooter from "./CreatePostEditorFooter";
import ErrorDialog from "./ErrorDialog";
import { useTextEditor } from "@/components/text_editor/useTextEditor";
import { useCreateComment } from "./useCreateComment";

const CreateComment: React.FC<CreatePostProps> = ({
  isActive,
  handleOpenComment,
  handleClickCancel,
  channel,
  subChannelId,
  topicId,
  handleSucceedPost,
}) => {
  const i18n = usePrfsI18N();
  const [error, setError] = React.useState<string | null>(null);
  const { editor } = useTextEditor();
  const [showMenuBar, setShowMenuBar] = React.useState(false);

  const toggleMenuBar = React.useCallback(() => {
    setShowMenuBar(b => !b);
  }, [setShowMenuBar]);

  const handleOpenCommentExt = React.useCallback(() => {
    handleOpenComment();
    if (editor) {
      editor.commands.focus();
    }
  }, [handleOpenComment, editor]);

  const {
    handleClickComment,
    handleSucceedGetSession,
    sessionKey,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
  } = useCreateComment({
    setError,
    editor,
    channel,
    topicId,
    handleSucceedPost,
    subChannelId,
  });

  const handleClickClose = React.useCallback(() => {
    setError(null);
  }, [setError]);

  return (
    <>
      <div className={styles.wrapper}>
        {isActive ? (
          <div>
            {error && <ErrorDialog handleClickClose={handleClickClose} error={error} />}
            <div className={styles.inner}>
              {editor && (
                <TextEditor
                  editor={editor}
                  className={styles.editorWrapper}
                  showMenuBar={showMenuBar}
                />
              )}
              <CreatePostEditorFooter
                toggleMenuBar={toggleMenuBar}
                handleClickCancel={handleClickCancel}
                handleClickComment={handleClickComment}
              />
            </div>
            <PrfsIdSessionDialog
              sessionKey={sessionKey}
              isPrfsDialogOpen={isPrfsDialogOpen}
              setIsPrfsDialogOpen={setIsPrfsDialogOpen}
              actionLabel={i18n.create_proof.toLowerCase()}
              handleSucceedGetSession={handleSucceedGetSession}
            />
          </div>
        ) : (
          <div className={styles.addComment} onClick={handleOpenCommentExt}>
            {i18n.add_comment}
          </div>
        )}
      </div>
    </>
  );
};

export default CreateComment;

export interface CreatePostProps {
  isActive: boolean;
  handleOpenComment: () => void;
  handleClickCancel: () => void;
  handleSucceedPost: () => void;
  topicId: string;
  subChannelId: string;
  channel: ShyChannel;
}
