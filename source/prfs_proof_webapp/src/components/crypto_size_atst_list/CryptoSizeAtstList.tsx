"use client";

import React from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";
import { useMutation } from "@tanstack/react-query";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { atstApi } from "@taigalabs/prfs-api-js";
import { ComputeCryptoSizeTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoSizeTotalValuesRequest";

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

const CryptoSizeAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { prfsProofCredential } = useSignedInUser();
  const { mutateAsync: computeCryptoSizeTotalValuesRequest } = useMutation({
    mutationFn: (req: ComputeCryptoSizeTotalValuesRequest) => {
      return atstApi("compute_crypto_size_total_values", req);
    },
  });
  const handleClickCalculate = React.useCallback(async () => {
    if (prfsProofCredential) {
      const { payload } = await computeCryptoSizeTotalValuesRequest({
        account_id: prfsProofCredential.account_id,
      });

      console.log(123, payload);

      if (payload) {
      }
    }
  }, [prfsProofCredential, computeCryptoSizeTotalValuesRequest]);

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
