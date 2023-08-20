import React from "react";
import cn from "classnames";
import {
  offset as offset_fn,
  useFloating,
  useClick,
  useInteractions,
  useDismiss,
  flip,
} from "@floating-ui/react";

import styles from "./Popover.module.scss";

function Popover({ createPopover, createBase, offset, popoverClassName }: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), offset_fn(offset ? offset : 3)],
  });
  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const popoverElem = React.useMemo(() => {
    return createPopover(setIsOpen);
  }, [createPopover]);

  const baseElem = React.useMemo(() => {
    return createBase(isOpen);
  }, [createBase, isOpen]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()} role="button">
        {baseElem}
      </div>
      {isOpen && (
        <div
          className={cn(styles.popover, popoverClassName, "1")}
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
  offset?: number;
  createPopover: (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => React.ReactNode;
  popoverClassName?: string;
}
