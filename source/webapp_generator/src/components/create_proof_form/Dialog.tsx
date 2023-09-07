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

import styles from "./Dialog.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Dialog: React.FC = () => {
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

  return (
    <div className={styles.wrapper}>
      <button ref={refs.setReference} {...getReferenceProps()}>
        {i18n.choose_type.toUpperCase()}
      </button>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay className={styles.dialogOverlay} lockScroll>
            <FloatingFocusManager context={context}>
              <div
                className={styles.dialog}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                <h2 id={headingId}>Delete balloon</h2>
                <p id={descriptionId}>This action cannot be undone.</p>
                <button
                  onClick={() => {
                    console.log("Deleted.");
                    setIsOpen(false);
                  }}
                >
                  Confirm
                </button>
                <button onClick={() => setIsOpen(false)}>Cancel</button>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </div>
  );
};

export default Dialog;
