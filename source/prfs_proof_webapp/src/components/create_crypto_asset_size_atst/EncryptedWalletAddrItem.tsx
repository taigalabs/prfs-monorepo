import React from "react";
import cn from "classnames";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";

import styles from "./CreateCryptoAssetSizeAtst.module.scss";
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
import { AttestationStep } from "./AttestationStep";

const EncryptedWalletAddrItem: React.FC<EncryptedWalletAddrItemProps> = ({
  step,
  walletCacheKeys,
  walletAddrEnc,
}) => {
  const i18n = React.useContext(i18nContext);

  const walletCacheKeyElems = React.useMemo(() => {
    const elems = [];
    if (walletCacheKeys) {
      for (const key in walletCacheKeys) {
        elems.push(
          <p key={walletCacheKeys[key]} className={styles.cacheKey}>
            {walletCacheKeys[key].substring(0, 8)}...
          </p>,
        );
      }
    }
    return elems;
  }, [walletCacheKeys]);

  return (
    <AttestationListItem isDisabled={step < AttestationStep.POST_TWEET}>
      <AttestationListItemOverlay />
      <AttestationListItemNo>4</AttestationListItemNo>
      <AttestationListRightCol>
        <AttestationListItemDesc>
          <AttestationListItemDescTitle>
            {i18n.save_wallet_address_in_cache_for_future_use} (automatic)
          </AttestationListItemDescTitle>
          <div>
            {walletCacheKeyElems && (
              <div>
                <p>We will use the least recently used cache key among these: </p>
                <div>{walletCacheKeyElems}</div>
              </div>
            )}
            <div>
              <p>{i18n.encrypted_wallet_addr}: </p>
              <p>{walletAddrEnc}</p>
            </div>
          </div>
        </AttestationListItemDesc>
      </AttestationListRightCol>
    </AttestationListItem>
  );
};

export default EncryptedWalletAddrItem;

export interface EncryptedWalletAddrItemProps {
  step: AttestationStep;
  walletCacheKeys: Record<string, string> | null;
  walletAddrEnc: string | null;
}
