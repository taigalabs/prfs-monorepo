import React from "react";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
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

import styles from "./WalletDialog.module.scss";
import Fade from "../fade/Fade";
import { i18nContext } from "../contexts/i18nContext";
import WalletModal from "./WalletModal";

const WalletDialog: React.FC<WalletDialogProps> = ({ handleChangeAddress, zIndex }) => {
  const i18n = React.useContext(i18nContext);
  const [isOpen, setIsOpen] = React.useState(false);
  // const [walletAddr, setWalletAddr] = React.useState("");

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
    [handleChangeAddress, setIsOpen]
  );

  return (
    <div className={styles.wrapper}>
      <div>
        <div>
          <div className={styles.btnRow} ref={refs.setReference} {...getReferenceProps()}>
            <button>{i18n.address}</button>
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
        </div>
      </div>
    </div>
  );
};

export default WalletDialog;

export interface WalletDialogProps {
  handleChangeAddress: (addr: string) => void;
  zIndex?: number;
}
