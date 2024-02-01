"use client";

import React from "react";

import styles from "./CryptoAssetSizeAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoSizeAtstTable from "./CryptoAssetSizeAtstTable";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import { useSignedInUser } from "@/hooks/user";
import { MASTER_ACCOUNT_ID } from "@/mock/mock_data";
import ComputeTotalValueDialog from "./ComputeTotalValue";

const CryptoSizeAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { prfsProofCredential } = useSignedInUser();
  const [nonce, rerender] = React.useReducer(x => x + 1, 0);

  return (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle className={styles.title}>
            {i18n.crypto_asset_size_attestations}
          </AttestationsTitle>
          <AttestationsTopMenu>
            {prfsProofCredential?.account_id === MASTER_ACCOUNT_ID && (
              <li>
                <ComputeTotalValueDialog
                  credential={prfsProofCredential}
                  handleSucceedCompute={rerender}
                />
              </li>
            )}
          </AttestationsTopMenu>
        </AttestationsHeaderRow>
        {/* <AttestationsHeaderRow></AttestationsHeaderRow> */}
      </AttestationsHeader>
      <div>
        <CryptoSizeAtstTable nonce={nonce} />
      </div>
    </>
  );
};

export default CryptoSizeAtstList;

export interface CryptoSizeAtstListProps {}
