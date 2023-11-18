import React from "react";
import cn from "classnames";
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
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./PostDialog.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TextEditor from "@/components/text_editor/TextEditor";

const PostDialog: React.FC<PostDialogProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);
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

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay style={{ zIndex: 100 }}>
            <Fade className={styles.dialogOverlay}>
              <FloatingFocusManager context={context}>
                <div
                  className={styles.dialog}
                  ref={refs.setFloating}
                  aria-labelledby={headingId}
                  aria-describedby={descriptionId}
                  {...getFloatingProps()}
                >
                  <div className={styles.header}>
                    <div className={styles.title}>{i18n.choose_proof_type}</div>
                    <div className={styles.topBtnRow}>
                      <button onClick={() => setIsOpen(false)}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  </div>
                  <div className={styles.body}>
                    <TextEditor />
                  </div>
                  <div className={styles.footer}>
                    <button>{i18n.post}</button>
                  </div>
                </div>
              </FloatingFocusManager>
            </Fade>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default PostDialog;

export interface PostDialogProps {
  children: React.ReactNode;
}
