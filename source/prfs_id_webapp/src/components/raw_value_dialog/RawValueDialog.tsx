import React from "react";
import cn from "classnames";
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
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

import styles from "./RawValueDialog.module.scss";
import RawValueModal from "./RawValueModal";

const RawValueDialog: React.FC<ConnectWalletProps> = ({
  className,
  handleChangeItem,
  children,
  prfsSet,
}) => {
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

  const handleClickSubmit = React.useCallback(
    (addr: string) => {
      handleChangeItem(addr);
      setIsOpen(false);
    },
    [handleChangeItem, setIsOpen],
  );

  return (
    <>
      <div className={cn(styles.base, className)} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <FloatingPortal>
        {isOpen && prfsSet && (
          <FloatingOverlay className={styles.overlay}>
            <FloatingFocusManager context={context}>
              <div
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                <RawValueModal
                  handleClickClose={handleClickClose}
                  handleClickSubmit={handleClickSubmit}
                  prfsSet={prfsSet}
                />
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default RawValueDialog;

export interface ConnectWalletProps {
  className?: string;
  handleChangeItem: (item: string) => void;
  children: React.ReactNode;
  prfsSet: PrfsSet | null;
}
