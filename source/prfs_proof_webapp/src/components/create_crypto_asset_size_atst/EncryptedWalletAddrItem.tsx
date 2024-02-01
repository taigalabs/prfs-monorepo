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
  walletCacheKeyElems,
  walletAddrEnc,
}) => {
  const i18n = React.useContext(i18nContext);

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
            <div>
              <p>We will use the least recently used cache key among these: </p>
              <div>{walletCacheKeyElems}</div>
            </div>
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
  walletCacheKeyElems: React.ReactNode;
  walletAddrEnc: string | null;
}
