import React, { useId } from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
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
import { ShyProofWithProofType } from "@taigalabs/shy-entities/bindings/ShyProofWithProofType";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { Proof } from "@taigalabs/prfs-driver-interface";

import styles from "./ProofDialog.module.scss";
import ProofImage from "@/components/proof_image/ProofImage";
import VerifyProofDialog from "@/components/verify_proof_dialog/VerifyProofDialog";

const ProofDialog: React.FC<PostContentProps> = ({
  proof,
  // author_proof_ids,
  // author_proof_identity_inputs,
  // proof,
  // proof_type_id,
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

  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <div key={proof.shy_proof_id} className={styles.proofIdentity}>
          <img src={proof.img_url} />
          <p>{proof.proof_identity_input}</p>
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
                  <button onClick={handleClickClose}>
                    <AiOutlineClose />
                  </button>
                </div>
                {/* {proof && <ProofDataView proof={proof} />} */}
                <div>{/* <VerifyProofDialog proof={proof} proofTypeId={proof_type_id} /> */}</div>
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
  proof: ShyProofWithProofType;
  // imgUrl: string;
  // author_proof_ids: string[];
  // author_proof_identity_inputs: string;
  // proof: Proof;
  // proof_type_id: string;
}
