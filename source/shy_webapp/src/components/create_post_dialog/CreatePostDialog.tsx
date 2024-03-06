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

import styles from "./CreatePostDialog.module.scss";
import { pathParts, paths } from "@/paths";
import TextEditor from "@/components/text_editor/TextEditor";
import { useI18N } from "@/i18n/hook";
import { envs } from "@/envs";
// import EditorFooter from "./EditorFooter";
import { SHY_APP_ID } from "@/app_id";
import EditorFooter from "./EditorFooter";
import Button from "@/components/button/Button";

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({}) => {
  const i18n = useI18N();
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
  const headingId = useId();
  const descriptionId = useId();

  // const baseElem = React.useMemo(() => {
  //   return createBase();
  // }, [createBase]);

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        <Button variant="transparent_1" className={styles.btn}>
          <FaReply />
          <span>{i18n.reply}</span>
        </Button>
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay className={styles.floatingManager}>
            <Fade className={styles.overlay}>
              <FloatingFocusManager context={context}>
                <div
                  className={styles.dialog}
                  ref={refs.setFloating}
                  aria-labelledby={headingId}
                  aria-describedby={descriptionId}
                  {...getFloatingProps()}
                >
                  modal
                  {/* {children} */}
                </div>
              </FloatingFocusManager>
            </Fade>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default CreatePostDialog;

export interface CreatePostDialogProps {
  // children: React.ReactNode;
  // postId: string;
  // channel: ShyChannel;
}
