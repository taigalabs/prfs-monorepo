import React, { useId } from "react";
import {
  FloatingFocusManager,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./ShyCacheDialog.module.scss";
import { useShyCache } from "@/hooks/user";
import ShyCacheModal from "./ShyCacheModal";

const ShyCacheDialog: React.FC<ShyCacheDialogProps> = () => {
  const { shyCache } = useShyCache();
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [offset(10), flip({ fallbackAxisSideDirection: "end" }), shift()],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  const headingId = useId();

  const i18n = usePrfsI18N();

  const handleCloseModal = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        {i18n.cache}
      </div>
      {isOpen && (
        <FloatingFocusManager context={context}>
          <div
            className={styles.dialog}
            ref={refs.setFloating}
            aria-labelledby={headingId}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <ShyCacheModal shyCache={shyCache} handleCloseModal={handleCloseModal} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default ShyCacheDialog;

export interface ShyCacheDialogProps {}
