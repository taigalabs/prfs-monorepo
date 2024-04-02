"use client";

import React from "react";
import { useRerender } from "@taigalabs/prfs-react-lib/src/hooks/use_rerender";
import { AlertContent, AlertWrapper } from "@taigalabs/prfs-react-lib/src/alert/AlertComponents";

import styles from "./CryptoAssetAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoSizeAtstTable from "./CryptoAssetAtstTable";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import { useSignedInProofUser } from "@/hooks/user";
import { isMasterAccountId } from "@/mock/mock_data";
import ComputeTotalValueDialog from "./ComputeTotalValue";

const CryptoAssetAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { prfsProofCredential } = useSignedInProofUser();
  const { nonce, rerender } = useRerender();

  return (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle className={styles.title}>
            {i18n.crypto_asset_attestations}
          </AttestationsTitle>
          <AttestationsTopMenu>
            {isMasterAccountId(prfsProofCredential?.account_id) && (
              <li>
                <ComputeTotalValueDialog credential={prfsProofCredential!} rerender={rerender} />
              </li>
            )}
          </AttestationsTopMenu>
        </AttestationsHeaderRow>
        <AttestationsHeaderRow>
          <AlertWrapper variant="warn" rounded>
            <AlertContent>Pr33fawkej</AlertContent>
          </AlertWrapper>
        </AttestationsHeaderRow>
      </AttestationsHeader>
      <div>
        <CryptoSizeAtstTable nonce={nonce} />
      </div>
    </>
  );
};

export default CryptoAssetAtstList;

export interface CryptoSizeAtstListProps {}
