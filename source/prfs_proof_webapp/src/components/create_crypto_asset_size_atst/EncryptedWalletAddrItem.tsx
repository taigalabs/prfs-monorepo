import React from "react";
import cn from "classnames";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";

import styles from "./EncryptedWalletAddrItem.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  AttestationListItem,
  AttestationListItemDesc,
  AttestationListItemDescTitle,
  AttestationListItemNo,
  AttestationListItemOverlay,
  AttestationListRightCol,
} from "@/components/create_attestation/CreateAtstComponents";
import { AttestationStep } from "./create_crypto_asset_size_atst";

const EncryptedWalletAddrItem: React.FC<EncryptedWalletAddrItemProps> = ({
  // step,
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
    <AttestationListItem isDisabled={false}>
      <AttestationListItemOverlay />
      <AttestationListItemNo>{null}</AttestationListItemNo>
      <AttestationListRightCol>
        <AttestationListItemDesc>
          <AttestationListItemDescTitle>
            {i18n.save_wallet_address_in_cache_for_future_use} (automatic)
          </AttestationListItemDescTitle>
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
        </AttestationListItemDesc>
      </AttestationListRightCol>
    </AttestationListItem>
  );
};

export default EncryptedWalletAddrItem;

export interface EncryptedWalletAddrItemProps {
  // step: AttestationStep;
  walletCacheKeys: Record<string, string> | null;
  walletAddrEnc: string | null;
}
