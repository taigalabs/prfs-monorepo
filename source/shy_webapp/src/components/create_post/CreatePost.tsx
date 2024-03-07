import React from "react";
import Fade from "@taigalabs/prfs-react-lib/src/fade/Fade";
import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  useId,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { FaReply } from "@react-icons/all-files/fa/FaReply";

import styles from "./CreatePost.module.scss";
import { pathParts, paths } from "@/paths";
import TextEditor from "@/components/text_editor/TextEditor";
import { useI18N } from "@/i18n/hook";
import { envs } from "@/envs";
// import EditorFooter from "./EditorFooter";
import { SHY_APP_ID } from "@/app_id";
import EditorFooter from "./EditorFooter";
import Button from "@/components/button/Button";
import CreatePostEditorFooter from "./EditorFooter";

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const i18n = useI18N();

  const footer = React.useMemo(() => {
    return <CreatePostEditorFooter />;
  }, []);

  return (
    <div className={styles.wrapper}>
      <TextEditor footer={footer} />
    </div>
  );
};

export default CreatePost;

export interface CreatePostProps {}
