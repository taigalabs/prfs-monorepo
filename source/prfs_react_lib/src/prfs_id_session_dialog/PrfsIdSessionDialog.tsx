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

import styles from "./PrfsIdSessionDialog.module.scss";
import { i18nContext } from "../i18n/i18nContext";
import PrfsIdSessionModal from "./PrfsIdSessionModal";

const PrfsIdSessionDialog: React.FC<ProofRawDialogProps> = ({
  isPrfsDialogOpen,
  setIsPrfsDialogOpen,
}) => {
  const i18n = React.useContext(i18nContext);
  const { refs, context } = useFloating({
    open: isPrfsDialogOpen,
    onOpenChange: setIsPrfsDialogOpen,
  });
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePress: false });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
  const headingId = useId();
  const descriptionId = useId();

  return (
    <>
      {/* <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}> */}
      {/*   {children} */}
      {/* </div> */}
      <FloatingPortal>
        {isPrfsDialogOpen && (
          <FloatingOverlay className={styles.overlay} lockScroll>
            <FloatingFocusManager context={context}>
              <div
                className={styles.dialog}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                {/* <div className={styles.header}> */}
                {/*   <h1>{i18n.proof_raw}</h1> */}
                {/*   <button */}
                {/*     onClick={() => { */}
                {/*       setIsPrfsDialogOpen(false); */}
                {/*     }} */}
                {/*   > */}
                {/*     <AiOutlineClose /> */}
                {/*   </button> */}
                {/* </div> */}
                <PrfsIdSessionModal setIsOpen={setIsPrfsDialogOpen} />
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default PrfsIdSessionDialog;

export interface ProofRawDialogProps {
  isPrfsDialogOpen: boolean;
  setIsPrfsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // proofRaw: string;
  // children: React.ReactNode;
}
