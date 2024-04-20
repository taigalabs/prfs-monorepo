import React from "react";
import cn from "classnames";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

import styles from "./EncryptedWalletAddrItem.module.scss";
import { i18nContext } from "@/i18n/context";

const EncryptedWalletAddrItem: React.FC<EncryptedWalletAddrItemProps> = ({
  walletCacheKeys,
  walletAddrEnc,
}) => {
  const i18n = React.useContext(i18nContext);
  const [showDetail, setShowDetail] = React.useState(false);

  const walletCacheKeyElems = React.useMemo(() => {
    if (walletCacheKeys) {
      const elems = [];
      for (const key in walletCacheKeys) {
        elems.push(
          <p key={walletCacheKeys[key]} className={styles.cacheKey}>
            {abbrev7and5(walletCacheKeys[key])},
          </p>,
        );
      }
      return elems;
    } else {
      return null;
    }
  }, [walletCacheKeys]);

  const toggleShowDetail = React.useCallback(() => {
    setShowDetail(v => !v);
  }, [setShowDetail]);

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.valueDetail, { [styles.display]: showDetail })}>
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
      <div className={styles.successMsgRow}>
        <FaCheck className={styles.green} />
        <span>{i18n.successfully_created_data}</span>
      </div>
      <div className={styles.showDetailBtnRow}>
        <button type="button" onClick={toggleShowDetail}>
          <HoverableText>{showDetail ? i18n.hide_detail : i18n.show_detail}</HoverableText>
        </button>
      </div>
    </div>
  );
};

export default EncryptedWalletAddrItem;

export interface EncryptedWalletAddrItemProps {
  walletCacheKeys: Record<string, string> | null;
  walletAddrEnc: string | null;
}
