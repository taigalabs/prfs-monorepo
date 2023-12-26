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
  Placement,
} from "@floating-ui/react";

import styles from "./Tooltip.module.scss";

const Tooltip: React.FC<TooltipProps> = ({
  label,
  children,
  offset,
  className,
  show,
  placement,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement || "bottom",
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

  const shouldOpen = React.useMemo(() => {
    if (show === true) {
      return isOpen || show;
    } else if (show === false) {
      return false;
    } else {
      return isOpen;
    }
  }, [isOpen, show]);

  return (
    <>
      <div className={cn(styles.base, className)} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <FloatingPortal>
        {shouldOpen && (
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
  className?: string;
  offset?: number;
  show?: boolean;
  placement?: Placement;
}
