import React, { useId } from "react";
import cn from "classnames";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import styles from "./ProofRawDialog.module.scss";
import { i18nContext } from "@/i18n/context";

const ProofRawDialog: React.FC<ProofRawDialogProps> = ({ proofRaw, children }) => {
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
          <FloatingOverlay className={styles.overlay} lockScroll>
            <FloatingFocusManager context={context}>
              <div
                className={styles.dialog}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                <div className={styles.header}>
                  <h1>{i18n.proof_raw}</h1>
                  <button
                    onClick={() => {
                      console.log("Deleted.");
                      setIsOpen(false);
                    }}
                  >
                    <AiOutlineClose />
                  </button>
                </div>
                <div className={styles.data}>{proofRaw}</div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default ProofRawDialog;

export interface ProofRawDialogProps {
  proofRaw: string;
  children: React.ReactNode;
}
