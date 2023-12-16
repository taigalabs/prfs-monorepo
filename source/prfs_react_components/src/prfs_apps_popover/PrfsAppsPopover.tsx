import React, { useId } from "react";
import cn from "classnames";
import { BsThreeDots } from "@react-icons/all-files/bs/BsThreeDots";
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

import styles from "./PrfsAppsPopover.module.scss";
import Tooltip from "../tooltip/Tooltip";
import Modal from "./Modal";

const PrfsAppsPopover: React.FC<PrfsAppsPopoverProps> = ({
  className,
  children,
  isOpenClassName,
  tooltip,
  zIndex,
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
  const content = React.useMemo(() => {
    return tooltip ? (
      <Tooltip label={tooltip}>
        <BsThreeDots />
      </Tooltip>
    ) : (
      <BsThreeDots />
    );
  }, [tooltip]);

  return (
    <>
      <button
        className={cn(styles.base, {
          [styles.isOpen]: isOpen,
          [className!]: !!className,
          [isOpenClassName!]: !!isOpenClassName && isOpen,
        })}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {content}
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
            <Modal setIsOpen={setIsOpen}>{children}</Modal>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default PrfsAppsPopover;

export interface PrfsAppsPopoverProps {
  className?: string;
  isOpenClassName?: string;
  zIndex?: number;
  tooltip?: string;
  children: React.ReactNode;
}
