import React, { useId } from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { FaReply } from "@react-icons/all-files/fa/FaReply";
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

import styles from "./ProofDialog.module.scss";
import Button from "@/components/button/Button";
import ProofImage from "../proof_image/ProofImage";

const ProofDialog: React.FC<PostContentProps> = ({ imgUrl, author_proof_identity_inputs }) => {
  const i18n = usePrfsI18N();

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
      <div ref={refs.setReference} {...getReferenceProps()}>
        <div className={styles.proofIdentity}>
          <ProofImage className={styles.proofImage} imgUrl={imgUrl} />
          <p className={styles.proofIdentityInput}>{author_proof_identity_inputs}</p>
        </div>
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
                {/* <div className={styles.data}>{proofRaw}</div> */}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default ProofDialog;

export interface PostContentProps {
  imgUrl: string;
  author_proof_identity_inputs: string;
}
