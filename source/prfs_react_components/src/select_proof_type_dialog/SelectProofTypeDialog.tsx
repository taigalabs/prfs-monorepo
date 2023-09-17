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

import Fade from "../fade/Fade";
import Button from "../button/Button";
import styles from "./SelectProofTypeDialog.module.scss";
import { i18nContext } from "../contexts/i18nContext";
import ProofTypeTable from "./ProofTypeTable";
import { ProofTypeItem } from "./ProofTypeTable";
import CaptionedImg from "../captioned_img/CaptionedImg";

const SelectProofTypeDialog: React.FC<SelectProofTypeDialogProps> = ({
  handleSelectProofType,
  zIndex,
}) => {
  const i18n = React.useContext(i18nContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedProofTypeItem, setSelectedProofTypeItem] = React.useState<ProofTypeItem>();

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
    (proofTypeItem: ProofTypeItem) => {
      setIsOpen(false);
      setSelectedProofTypeItem(proofTypeItem);
      handleSelectProofType(proofTypeItem);
    },
    [handleSelectProofType, setIsOpen]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        <Button variant="white_gray_1">
          {selectedProofTypeItem ? (
            <div className={styles.chooseProofTypeBtnInner}>
              <CaptionedImg img_url={selectedProofTypeItem.imgUrl} size={32} />
              <p>{selectedProofTypeItem.label}</p>
            </div>
          ) : (
            i18n.choose_type.toUpperCase()
          )}
        </Button>
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay style={{ zIndex: zIndex || 200 }}>
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
                    <div className={styles.btnArea}>
                      <button onClick={() => setIsOpen(false)}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  </div>
                  <ProofTypeTable handleSelectVal={extendedProofTypeClickHandler} />
                </div>
              </FloatingFocusManager>
            </Fade>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </div>
  );
};

export default SelectProofTypeDialog;

export interface SelectProofTypeDialogProps {
  handleSelectProofType: (proofTypeItem: ProofTypeItem) => void;
  zIndex?: number;
}
