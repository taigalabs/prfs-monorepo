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

import styles from "./CachedAddressDialog.module.scss";
import { i18nContext } from "@/i18n/context";
import CachedAddressModal from "./CachedAddressModal";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

const CachedAddressDialog: React.FC<ConnectWalletProps> = ({
  handleChangeAddress,
  credential,
  zIndex,
  children,
}) => {
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
        {children}
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
                  <CachedAddressModal
                    handleClickClose={handleClickClose}
                    handleChangeAddress={extendedHandleChangeAddress}
                    credential={credential}
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

export default CachedAddressDialog;

export interface ConnectWalletProps {
  handleChangeAddress: (addr: string) => void;
  credential: PrfsIdCredential;
  zIndex?: number;
  children: React.ReactNode;
}
