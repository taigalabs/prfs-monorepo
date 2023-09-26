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
import { ProofTypeItem } from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/ProofTypeTable";

import styles from "./PostDialog.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";

const PostDialog: React.FC<PostDialogProps> = () => {
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

  const handleSelectProofType = React.useCallback(
    (proofTypeItem: ProofTypeItem) => {
      setSelectedProofTypeItem(proofTypeItem);
    },
    [setSelectedProofTypeItem]
  );

  const extendedProofTypeClickHandler = React.useCallback(() => {
    setIsOpen(false);
    // setSelectedProofTypeItem(proofTypeItem);
    // handleSelectProofType(proofTypeItem);
  }, [setIsOpen]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        <Button variant="white_black_1">{i18n.post}</Button>
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
                  <div className={styles.body}>55</div>
                  <div className={styles.bottomBtnRow}>
                    <div className={styles.selectProofType}>
                      <SelectProofTypeDialog handleSelectProofType={handleSelectProofType} />
                    </div>
                    {selectedProofTypeItem && (
                      <Fade>
                        <div id="prfs-sdk-container"></div>
                      </Fade>
                    )}
                  </div>
                </div>
              </FloatingFocusManager>
            </Fade>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </div>
  );
};

export default PostDialog;

export interface PostDialogProps {}
