import React from "react";
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

import styles from "./DialogDefault.module.scss";

const DialogDefault: React.FC<DialogDefaultProps> = ({ zIndex, createModal, createBase }) => {
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

  const modalElem = React.useMemo(() => {
    return createModal(setIsOpen);
  }, [createModal]);

  const baseElem = React.useMemo(() => {
    return createBase(isOpen);
  }, [createBase, isOpen]);

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        {baseElem}
        {/* {children ? children : <button>{i18n.address}</button>} */}
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay style={{ zIndex: zIndex || 200 }}>
            <FloatingFocusManager context={context}>
              <div
                className={styles.dialog}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                {modalElem}
                {/* <WalletModal */}
                {/*   handleClickClose={handleClickClose} */}
                {/*   handleChangeAddress={extendedHandleChangeAddress} */}
                {/* /> */}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default DialogDefault;

export interface DialogDefaultProps {
  zIndex?: number;
  // children?: React.ReactNode;
  createBase: (isOpen: boolean) => React.ReactNode;
  createModal: (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => React.ReactNode;
}
