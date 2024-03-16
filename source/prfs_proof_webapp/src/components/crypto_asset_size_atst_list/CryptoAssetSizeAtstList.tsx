"use client";

import React from "react";
import { useRerender } from "@taigalabs/prfs-react-lib/src/hooks/use_rerender";

import styles from "./CryptoAssetSizeAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoSizeAtstTable from "./CryptoAssetSizeAtstTable";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import { useSignedInProofUser } from "@/hooks/user";
import { isMasterAccountId } from "@/mock/mock_data";
import ComputeTotalValueDialog from "./ComputeTotalValue";

const CryptoSizeAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { prfsProofCredential } = useSignedInProofUser();
  const { nonce, rerender } = useRerender();

  return (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle className={styles.title}>
            {i18n.crypto_asset_size_attestations}
          </AttestationsTitle>
          <AttestationsTopMenu>
            {isMasterAccountId(prfsProofCredential?.account_id) && (
              <li>
                <ComputeTotalValueDialog credential={prfsProofCredential!} rerender={rerender} />
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
