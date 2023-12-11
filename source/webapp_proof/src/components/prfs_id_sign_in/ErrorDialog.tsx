import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { AiOutlineQrcode } from "@react-icons/all-files/ai/AiOutlineQrcode";
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
import Link from "next/link";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import styles from "./ErrorDialog.module.scss";
import { i18nContext } from "@/contexts/i18n";

const ErrorDialog: React.FC<ErrorDialogProps> = ({ errorMsg, handleClose }) => {
  const i18n = React.useContext(i18nContext);
  const [isOpen, setIsOpen] = React.useState(true);
  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
    handleClose();
  }, [setIsOpen, handleClose]);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: handleClickClose,
  });
  const headingId = useId();
  const descriptionId = useId();
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}></div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay className={styles.overlay} lockScroll>
            <Fade>
              <FloatingFocusManager context={context}>
                <div
                  className={styles.dialog}
                  ref={refs.setFloating}
                  aria-labelledby={headingId}
                  aria-describedby={descriptionId}
                  {...getFloatingProps()}
                >
                  <p className={styles.msg}>{errorMsg}</p>
                  <div className={styles.btnRow}>
                    <div />
                    <Button
                      variant="transparent_blue_2"
                      className={styles.closeBtn}
                      handleClick={handleClickClose}
                    >
                      {i18n.close_and_return.toUpperCase()}
                    </Button>
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

export default ErrorDialog;

export interface ErrorDialogProps {
  errorMsg: string | null;
  handleClose: () => void;
}
