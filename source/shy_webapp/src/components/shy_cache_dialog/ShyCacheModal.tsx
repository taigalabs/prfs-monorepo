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

import styles from "./ShyCacheModal.module.scss";
import { LocalShyCache } from "@/storage/shy_cache";

const ShyCacheModal: React.FC<ShyCacheDialogProps> = ({ shyCache }) => {
  const hash = React.useMemo(() => {
    if (shyCache) {
    }
  }, [shyCache]);

  return <div className={styles.wrapper}>base</div>;
};

export default ShyCacheModal;

export interface ShyCacheDialogProps {
  shyCache: LocalShyCache | null;
}
