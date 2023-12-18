import React, { useId } from "react";
import cn from "classnames";
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

import styles from "./PrfsCredentialPopover.module.scss";
import { i18nContext } from "../i18n/i18nContext";
import Modal from "./Modal";

const PrfsCredentialPopover: React.FC<PrfsCredentialPopoverProps> = ({
  className,
  credential,
  isOpenClassName,
  handleClickSignOut,
  handleInitFail,
}) => {
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
  const [printable, setPrintable] = React.useState({
    label: "",
    avatar_color: "",
  });

  React.useEffect(() => {
    if (credential && credential.account_id.length > 6) {
      const label = credential.account_id.substring(2, 5);
      const { avatar_color } = credential;
      setPrintable({ label, avatar_color });
    } else {
      handleInitFail();
    }
  }, [credential, setPrintable]);

  return (
    printable && (
      <>
        <div
          className={cn(styles.base, {
            [styles.isOpen]: isOpen,
            [className!]: !!className,
            [isOpenClassName!]: !!isOpenClassName && isOpen,
          })}
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          <button style={{ backgroundColor: printable.avatar_color }}>
            <span className={styles.id}>{printable.label}</span>
          </button>
        </div>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              className={styles.popoverWrapper}
              ref={refs.setFloating}
              style={floatingStyles}
              aria-labelledby={headingId}
              {...getFloatingProps()}
            >
              <Modal
                id={credential.account_id}
                setIsOpen={setIsOpen}
                handleClickSignOut={handleClickSignOut}
              />
            </div>
          </FloatingFocusManager>
        )}
      </>
    )
  );
};

export default PrfsCredentialPopover;

export interface PrfsCredentialPopoverProps {
  credential: {
    account_id: string;
    avatar_color: string;
  };
  className?: string;
  isOpenClassName?: string;
  zIndex?: number;
  handleInitFail: () => void;
  handleClickSignOut: () => void;
}
