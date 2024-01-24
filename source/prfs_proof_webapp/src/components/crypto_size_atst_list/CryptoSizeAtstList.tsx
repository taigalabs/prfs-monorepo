"use client";

import React from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";

import styles from "./CryptoSizeAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoSizeAtstTable from "./CryptoSizeAtstTable";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { useSignedInUser } from "@/hooks/user";
import { MASTER_ACCOUNT_ID } from "@/mock/mock_data";

const CryptoSizeAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { prfsProofCredential } = useSignedInUser();
  const handleClickCalculate = React.useCallback(() => {}, [prfsProofCredential]);

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
                <Button variant="circular_gray_1" handleClick={handleClickCalculate}>
                  <FaCalculator />
                </Button>
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
