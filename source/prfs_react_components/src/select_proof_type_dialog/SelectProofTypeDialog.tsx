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
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import { IoIosSearch } from "@react-icons/all-files/io/IoIosSearch";

import Fade from "../fade/Fade";
import Button from "../button/Button";
import styles from "./SelectProofTypeDialog.module.scss";
import { i18nContext } from "../contexts/i18nContext";
import ProofTypeModal, { type ProofTypeItem } from "./ProofTypeModal";
import CaptionedImg from "../captioned_img/CaptionedImg";
import ProofTypeModal2 from "./ProofTypeModal2";

const SelectProofTypeDialog: React.FC<SelectProofTypeDialogProps> = ({ handleSelectProofType }) => {
  const i18n = React.useContext(i18nContext);
  const [selectedProofTypeItem, setSelectedProofTypeItem] = React.useState<ProofTypeItem>();
  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(0), flip({ fallbackAxisSideDirection: "end" }), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

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
      <div ref={refs.setReference} {...getReferenceProps()}>
        <div
          className={cn({
            [styles.chooseProofTypeBtnWrapper]: true,
            [styles.wide]: !selectedProofTypeItem,
            [styles.isOpen]: !!isOpen,
          })}
        >
          <Button variant="white_gray_1">
            {selectedProofTypeItem ? (
              <div className={styles.proofTypeBtn}>
                <CaptionedImg img_url={selectedProofTypeItem.imgUrl} size={30} />
                <p className={styles.label}>{selectedProofTypeItem.label}</p>
              </div>
            ) : (
              <div className={styles.placeholderBtn}>
                <div>
                  {isOpen && <FaSearch />}
                  <p className={styles.placeholder}>{i18n.find_what_to_prove}</p>
                </div>
                <div>
                  <IoIosSearch />
                </div>
              </div>
            )}
          </Button>
        </div>
      </div>
      {isOpen && (
        <FloatingFocusManager context={context}>
          <div
            className={styles.modalWrapper}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            {...getFloatingProps()}
          >
            {/* power */}
            <ProofTypeModal2 handleSelectVal={extendedProofTypeClickHandler} />
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};

export default SelectProofTypeDialog;

export interface SelectProofTypeDialogProps {
  handleSelectProofType: (proofTypeItem: ProofTypeItem) => void;
}
