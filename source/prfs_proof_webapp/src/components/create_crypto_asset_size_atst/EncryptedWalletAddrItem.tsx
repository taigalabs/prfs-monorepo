import React from "react";
import cn from "classnames";

import styles from "./EncryptedWalletAddrItem.module.scss";
import { i18nContext } from "@/i18n/context";

const EncryptedWalletAddrItem: React.FC<EncryptedWalletAddrItemProps> = ({
  walletCacheKeys,
  walletAddrEnc,
}) => {
  const i18n = React.useContext(i18nContext);

  const walletCacheKeyElems = React.useMemo(() => {
    if (walletCacheKeys) {
      const elems = [];
      for (const key in walletCacheKeys) {
        elems.push(
          <p key={walletCacheKeys[key]} className={styles.cacheKey}>
            {walletCacheKeys[key].substring(0, 8)}...
          </p>,
        );
      }
      return elems;
    } else {
      return null;
    }
  }, [walletCacheKeys]);

  return (
    <div className={styles.wrapper}>
      <div>{i18n.save_wallet_address_in_cache_for_future_use} (automatic)</div>
      <div className={styles.content}>
        {walletCacheKeyElems && (
          <div className={styles.item}>
            <p className={styles.label}>
              We will use the least recently used cache key among these
            </p>
            <div>{walletCacheKeyElems}</div>
          </div>
        )}
        {walletAddrEnc && (
          <div className={styles.item}>
            <p className={styles.label}>{i18n.encrypted_wallet_addr}</p>
            <p>{walletAddrEnc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncryptedWalletAddrItem;

export interface EncryptedWalletAddrItemProps {
  walletCacheKeys: Record<string, string> | null;
  walletAddrEnc: string | null;
}
