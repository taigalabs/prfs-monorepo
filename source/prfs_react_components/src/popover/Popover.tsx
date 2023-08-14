import React from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import {
  offset,
  useFloating,
  useClick,
  useInteractions,
  useDismiss,
  flip,
} from "@floating-ui/react";

import styles from "./Popover.module.scss";

function Popover({ popoverElem, createBase }: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), offset(3)],
  });
  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  // const upgradedHandleSelectVal = React.useCallback(() => {
  //   // handleSelectVal(data);
  //   setIsOpen(false);
  // }, [setIsOpen]);

  const baseElem = React.useMemo(() => {
    return createBase(isOpen);
  }, [createBase, isOpen]);

  return (
    <div className={styles.dropdownWrapper}>
      <div
        className={styles.dropdownBase}
        ref={refs.setReference}
        {...getReferenceProps()}
        role="button"
      >
        {baseElem}
      </div>
      {isOpen && (
        <div
          className={styles.dropdown}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {popoverElem}
        </div>
      )}
    </div>
  );
}

export default Popover;

export interface PopoverProps {
  createBase: (isOpen: boolean) => React.ReactNode;
  popoverElem: React.ReactNode;
  // handleSelectVal: (data: T) => void;
}
