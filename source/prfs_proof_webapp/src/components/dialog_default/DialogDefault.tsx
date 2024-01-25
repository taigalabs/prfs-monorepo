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
import Fade from "@taigalabs/prfs-react-lib/src/fade/Fade";

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
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay className={styles.floatingManager} style={{ zIndex: zIndex }}>
            <Fade className={styles.overlay}>
              <FloatingFocusManager context={context}>
                <div
                  className={styles.dialog}
                  ref={refs.setFloating}
                  aria-labelledby={headingId}
                  aria-describedby={descriptionId}
                  {...getFloatingProps()}
                >
                  {modalElem}
                </div>
              </FloatingFocusManager>
            </Fade>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default DialogDefault;

export interface DialogDefaultProps {
  zIndex?: number;
  createBase: (isOpen: boolean) => React.ReactNode;
  createModal: (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => React.ReactNode;
}
