import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
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
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import styles from "./SelectProofTypeDialog.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ProofTypeTable from "./ProofTypeTable";

const SelectProofTypeDialog: React.FC<SelectProofTypeDialogProps> = ({ handleSelectProofType }) => {
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

  const extendedProofTypeClickHandler = React.useCallback(
    (proofTypeId: string) => {
      setIsOpen(false);
      handleSelectProofType(proofTypeId);
    },
    [handleSelectProofType, setIsOpen]
  );

  return (
    <div className={styles.wrapper}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <Button variant="white_gray_1">{i18n.choose_type.toUpperCase()}</Button>
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
                  <div className={styles.header}>
                    <div className={styles.title}>{i18n.choose_proof_type}</div>
                    <div className={styles.btnArea}>
                      <AiOutlineClose />
                    </div>
                  </div>
                  <ProofTypeTable handleSelectVal={extendedProofTypeClickHandler} />
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          </Fade>
        )}
      </FloatingPortal>
    </div>
  );
};

export default SelectProofTypeDialog;

export interface SelectProofTypeDialogProps {
  handleSelectProofType: (proofTypeId: string) => void;
}
