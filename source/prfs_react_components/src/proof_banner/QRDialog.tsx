import React from "react";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";
import { AiOutlineQrcode } from "@react-icons/all-files/ai/AiOutlineQrcode";
import Popover from "../popover/Popover";
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
import Button from "../button/Button";

const QRDialog: React.FC<QRDialogProps> = ({ data }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  // const [selectedProofTypeItem, setSelectedProofTypeItem] = React.useState<ProofTypeItem>();

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

  // const extendedProofTypeClickHandler = React.useCallback(() => {
  //   setIsOpen(false);
  //   // setSelectedProofTypeItem(proofTypeItem);
  //   // handleSelectProofType(proofTypeItem);
  // }, [setIsOpen]);

  return (
    <div className={styles.wrapper}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <button>
          <AiOutlineQrcode />
        </button>
      </div>
      <FloatingPortal>
        {isOpen && (
          <Fade>
            <FloatingOverlay className={styles.dialogOverlay} lockScroll>
              <FloatingFocusManager context={context}>
                <div
                  className={styles.dialog}
                  ref={refs.setFloating}
                  aria-labelledby={headingId}
                  aria-describedby={descriptionId}
                  {...getFloatingProps()}
                >
                  <div className={styles.QRContainer}>
                    <div className={styles.btnRow}>
                      <AiOutlineClose />
                    </div>
                    <QRCodeView data={data} />
                  </div>
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          </Fade>
        )}
      </FloatingPortal>
    </div>
  );
};

export default QRDialog;

export interface QRDialogProps {
  data: any;
}
