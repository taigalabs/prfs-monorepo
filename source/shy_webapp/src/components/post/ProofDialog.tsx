import React, { useId } from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { FaReply } from "@react-icons/all-files/fa/FaReply";
import ProofDataView from "@taigalabs/prfs-react-lib/src/proof_data_view/ProofDataView";
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
import ProofImage from "@/components/proof_image/ProofImage";
import { Proof } from "@taigalabs/prfs-driver-interface";
import VerifyProofDialog from "../verify_proof_dialog/VerifyProofDialog";

const ProofDialog: React.FC<PostContentProps> = ({
  imgUrl,
  author_proof_identity_inputs,
  proof,
  proof_type_id,
}) => {
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
                      setIsOpen(false);
                    }}
                  >
                    <AiOutlineClose />
                  </button>
                </div>
                {proof && <ProofDataView proof={proof} />}
                <div>
                  <VerifyProofDialog proof={proof} />
                </div>
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
  proof: Proof;
}
