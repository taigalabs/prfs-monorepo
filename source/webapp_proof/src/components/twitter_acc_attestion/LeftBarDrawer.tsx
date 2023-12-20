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
import cn from "classnames";

import styles from "./LeftBarDrawer.module.scss";

const LeftBarDrawer: React.FC<LeftBarDrawerProps> = ({ children, isOpen, setIsOpen }) => {
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

  return (
    <>
      {/* <div ref={refs.setReference} {...getReferenceProps()} /> */}
      <FloatingPortal>
        {true && (
          <FloatingOverlay className={cn(styles.overlay, { [styles.isOpen]: isOpen })} lockScroll>
            <FloatingFocusManager context={context}>
              <div
                className={cn(styles.drawer)}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                {children}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default LeftBarDrawer;

export interface LeftBarDrawerProps {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: () => void;
}
