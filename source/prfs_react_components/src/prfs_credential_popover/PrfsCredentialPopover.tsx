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
    avatarColor: "",
  });

  React.useEffect(() => {
    if (credential && credential.id.length > 6) {
      const label = credential.id.substring(2, 5);
      const { avatarColor } = credential;
      setPrintable({ label, avatarColor });
    } else {
      handleInitFail();
    }
  }, [credential, setPrintable]);

  return (
    printable && (
      <>
        <button
          className={cn(styles.base, {
            [styles.isOpen]: isOpen,
            [className!]: !!className,
            [isOpenClassName!]: !!isOpenClassName && isOpen,
          })}
          ref={refs.setReference}
          {...getReferenceProps()}
          style={{ backgroundColor: printable.avatarColor }}
        >
          <span>{printable.label}</span>
        </button>
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
                id={credential.id}
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
    id: string;
    avatarColor: string;
  };
  className?: string;
  isOpenClassName?: string;
  zIndex?: number;
  handleInitFail: () => void;
  handleClickSignOut: () => void;
}
