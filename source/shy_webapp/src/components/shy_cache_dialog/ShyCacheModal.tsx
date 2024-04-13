import React, { useId } from "react";

import styles from "./ShyCacheModal.module.scss";
import { LocalShyCache } from "@/storage/shy_cache";

const ShyCacheModal: React.FC<ShyCacheDialogProps> = ({ shyCache }) => {
  const elems = React.useMemo(() => {
    if (shyCache) {
      const els = [];
      for (const key in shyCache) {
        const item = shyCache[key];
        els.push(
          <div key={key}>
            <p>{key}</p>
            <p>{item}</p>
          </div>,
        );
      }
    } else {
      return <span>Cache is empty</span>;
    }
  }, [shyCache]);

  return <div className={styles.wrapper}>{elems}333333</div>;
};

export default ShyCacheModal;

export interface ShyCacheDialogProps {
  shyCache: LocalShyCache | null;
}
