import React, { useId } from "react";

import styles from "./ShyCacheModal.module.scss";
import { LocalShyCache } from "@/storage/shy_cache";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import Button from "../button/Button";

const ShyCacheModal: React.FC<ShyCacheDialogProps> = ({ shyCache, handleCloseModal }) => {
  const i18n = usePrfsI18N();

  const elems = React.useMemo(() => {
    if (shyCache) {
      const ret = [];
      for (const key in shyCache) {
        const val = shyCache[key];

        ret.push(
          <div key={key}>
            <p className={styles.key}>{key}</p>
            <p className={styles.value}>{val}</p>
          </div>,
        );
      }
      return ret;
    } else {
      return <span>Cache is empty</span>;
    }
  }, [shyCache]);

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{i18n.local_cache_items}</p>
      <div className={styles.items}>{elems}</div>
      <div className={styles.btnRow}>
        <Button variant="green_1" handleClick={handleCloseModal}>
          {i18n.close}
        </Button>
      </div>
    </div>
  );
};

export default ShyCacheModal;

export interface ShyCacheDialogProps {
  shyCache: LocalShyCache | null;
  handleCloseModal: () => void;
}
