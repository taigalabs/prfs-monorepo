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
import { useAppDispatch } from "@/state/hooks";
import { emptyShyCache } from "@/state/userReducer";

const ShyCacheDialog: React.FC<ShyCacheDialogProps> = () => {
  const { shyCache } = useShyCache();
  const dispatch = useAppDispatch();
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

  const handleClickEmptyCache = React.useCallback(() => {
    dispatch(emptyShyCache());
  }, [dispatch]);

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
            <ShyCacheModal
              shyCache={shyCache}
              handleCloseModal={handleCloseModal}
              handleClickEmptyCache={handleClickEmptyCache}
            />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default ShyCacheDialog;

export interface ShyCacheDialogProps {}
