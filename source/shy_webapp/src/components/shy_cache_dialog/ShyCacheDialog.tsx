import React, { useId } from "react";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import styles from "./ShyCacheDialog.module.scss";
import { useShyCache } from "@/hooks/user";
import ShyCacheModal from "./ShyCacheModal";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

const ShyCacheDialog: React.FC<ShyCacheDialogProps> = () => {
  const { shyCache, isCacheInitialized } = useShyCache();
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePress: false });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
  const headingId = useId();
  const descriptionId = useId();
  const i18n = usePrfsI18N();

  const hash = React.useMemo(() => {
    if (shyCache) {
    }
  }, [shyCache]);

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        {i18n.cache}
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay className={styles.overlay} lockScroll>
            <FloatingFocusManager context={context}>
              <div
                className={styles.dialog}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                <ShyCacheModal shyCache={shyCache} />
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default ShyCacheDialog;

export interface ShyCacheDialogProps {}
