import React from "react";
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
import Fade from "../fade/Fade";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import styles from "./QRDialog.module.scss";
import QRCodeView from "../qrcode_view/QRCodeView";

const QRDialog: React.FC<QRDialogProps> = ({ data }) => {
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

  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <div className={styles.wrapper}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <button>
          <AiOutlineQrcode />
        </button>
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay className={styles.dialogOverlay} lockScroll>
            <Fade>
              <div className={styles.backdrop}>
                <FloatingFocusManager context={context}>
                  <div
                    className={styles.dialog}
                    ref={refs.setFloating}
                    aria-labelledby={headingId}
                    aria-describedby={descriptionId}
                    {...getFloatingProps()}
                  >
                    <div className={styles.QRContainer}>
                      <button className={styles.closeBtn} onClick={handleClickClose}>
                        <AiOutlineClose />
                      </button>
                      <QRCodeView data={data} size={210} />
                    </div>
                  </div>
                </FloatingFocusManager>
              </div>
            </Fade>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </div>
  );
};

export default QRDialog;

export interface QRDialogProps {
  data: any;
}
