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
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

import styles from "./CachedItemDialog.module.scss";
import { i18nContext } from "@/i18n/context";
import CachedMemberIdModal from "./CachedItemModal";

const CachedItemDialog: React.FC<ConnectWalletProps> = ({
  handleChangeItem,
  zIndex,
  children,
  prfsSet,
}) => {
  const i18n = React.useContext(i18nContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const click = useClick(context, {
    enabled: !!prfsSet,
  });
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
  const headingId = useId();
  const descriptionId = useId();

  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const extendedHandleChangeItem = React.useCallback(
    (addr: string) => {
      handleChangeItem(addr);
      setIsOpen(false);
    },
    [handleChangeItem, setIsOpen],
  );

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <FloatingPortal>
        {isOpen && prfsSet && (
          <FloatingOverlay style={{ zIndex: zIndex || 200 }}>
            <Fade className={styles.fadeOverlay}>
              <FloatingFocusManager context={context}>
                <div
                  className={styles.dialog}
                  ref={refs.setFloating}
                  aria-labelledby={headingId}
                  aria-describedby={descriptionId}
                  {...getFloatingProps()}
                >
                  <CachedMemberIdModal
                    handleClickClose={handleClickClose}
                    handleChangeItem={extendedHandleChangeItem}
                    prfsSet={prfsSet}
                  />
                </div>
              </FloatingFocusManager>
            </Fade>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default CachedItemDialog;

export interface ConnectWalletProps {
  handleChangeItem: (item: string) => void;
  zIndex?: number;
  children: React.ReactNode;
  prfsSet: PrfsSet | null;
}
