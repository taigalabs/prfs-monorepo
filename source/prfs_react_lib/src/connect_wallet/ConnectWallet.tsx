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

import styles from "./ConnectWallet.module.scss";
import Fade from "../fade/Fade";
import { i18nContext } from "../i18n/i18nContext";
import WalletModal from "./WalletModal";

const ConnectWallet: React.FC<ConnectWalletProps> = ({ handleChangeAddress, zIndex, children }) => {
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

  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const extendedHandleChangeAddress = React.useCallback(
    (addr: string) => {
      handleChangeAddress(addr);
      setIsOpen(false);
    },
    [handleChangeAddress, setIsOpen],
  );

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        {children ? children : <button type="button">{i18n.address}</button>}
      </div>
      <FloatingPortal>
        {isOpen && (
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
                  <WalletModal
                    handleClickClose={handleClickClose}
                    handleChangeAddress={extendedHandleChangeAddress}
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

export default ConnectWallet;

export interface ConnectWalletProps {
  handleChangeAddress: (addr: string) => void;
  zIndex?: number;
  children?: React.ReactNode;
}
