"use client";

import React from "react";

import styles from "./CryptoSizeAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoSizeAtstTable from "./CryptoSizeAtstTable";
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
                <ComputeTotalValueDialog credential={prfsProofCredential} />
              </li>
            )}
          </AttestationsTopMenu>
        </AttestationsHeaderRow>
        {/* <AttestationsHeaderRow></AttestationsHeaderRow> */}
      </AttestationsHeader>
      <div>
        <CryptoSizeAtstTable />
      </div>
    </>
  );
};

export default CryptoSizeAtstList;

export interface CryptoSizeAtstListProps {}
