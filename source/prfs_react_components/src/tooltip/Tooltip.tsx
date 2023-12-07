import React from "react";
import cn from "classnames";
import {
  useFloating,
  autoUpdate,
  offset as offsetFn,
  flip,
  shift,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  useHover,
} from "@floating-ui/react";

import styles from "./Tooltip.module.scss";

const Tooltip: React.FC<TooltipProps> = ({ label, children, offset }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom",
    whileElementsMounted: autoUpdate,
    middleware: [
      offsetFn(offset || 3),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <FloatingPortal>
        {isOpen && (
          <div
            className={styles.tooltip}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {label}
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default Tooltip;

export interface TooltipProps {
  label: string;
  children: React.ReactNode;
  offset?: number;
}
