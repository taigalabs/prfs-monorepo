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
  offset,
  autoUpdate,
} from "@floating-ui/react";
import { IoIosSearch } from "@react-icons/all-files/io/IoIosSearch";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";

import styles from "./SelectProofTypeDialog.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ProofTypeModal2 from "./ProofTypeModal2";
import TutorialStepper from "../tutorial/TutorialStepper";

const SearchIcon = () => {
  return (
    <div className={styles.searchIcon}>
      <IoIosSearch />
    </div>
  );
};

const SelectProofTypeDialog: React.FC<SelectProofTypeDialogProps> = ({
  proofType,
  handleSelectProofType,
}) => {
  const i18n = React.useContext(i18nContext);
  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(0)],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const headingId = useId();
  const descriptionId = useId();

  const extendedProofTypeClickHandler = React.useCallback(
    (proofType: PrfsProofType) => {
      setIsOpen(false);
      handleSelectProofType(proofType);
    },
    [handleSelectProofType, setIsOpen]
  );

  return (
    <div
      className={cn({
        [styles.wrapper]: true,
        [styles.proofTypeChosen]: !!proofType,
        [styles.isOpen]: !!isOpen,
      })}
    >
      <TutorialStepper steps={[1]} fullWidth mainAxisOffset={20} crossAxisOffset={15}>
        <button className={styles.button} ref={refs.setReference} {...getReferenceProps()}>
          {proofType ? (
            <div className={styles.proofTypeBtn}>
              <CaptionedImg img_url={proofType.img_url} size={32} />
              <p className={styles.label}>{proofType.label}</p>
            </div>
          ) : (
            <div className={styles.placeholderBtn}>
              <div>
                {isOpen && <SearchIcon />}
                <p className={styles.placeholder}>{i18n.find_what_to_prove}</p>
              </div>
              <div>
                <IoIosSearch />
              </div>
            </div>
          )}
        </button>
      </TutorialStepper>
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
            <ProofTypeModal2 handleSelectVal={extendedProofTypeClickHandler} />
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};

export default SelectProofTypeDialog;

export interface SelectProofTypeDialogProps {
  proofType: PrfsProofType | undefined;
  handleSelectProofType: (proofType: PrfsProofType) => void;
}
