"use client";

import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { FaFileImport } from "@react-icons/all-files/fa/FaFileImport";
import { useMutation } from "@tanstack/react-query";

import styles from "./CryptoHolderSet.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoHolderSetTable from "./CryptoHolderSetTable";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import { atstApi, prfsApi2 } from "@taigalabs/prfs-api-js";
import { ComputeCryptoSizeTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoSizeTotalValuesRequest";

const CryptoHolderSet: React.FC<CryptoHolderSetProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { mutateAsync: computeCryptoSizeTotalValuesRequest, isPending } = useMutation({
    mutationFn: (req: ComputeCryptoSizeTotalValuesRequest) => {
      return prfsApi2("compute_crypto_size_total_values", req);
    },
  });
  const handleClickImportCryptoHolders = React.useCallback(() => {}, []);

  return (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle className={styles.title}>{i18n.crypto_holders}</AttestationsTitle>
        </AttestationsHeaderRow>
        <AttestationsHeaderRow>
          <ul>
            <li>
              <Button
                variant="transparent_blue_2"
                noTransition
                handleClick={handleClickImportCryptoHolders}
                type="button"
              >
                <div className={styles.btnContent}>
                  <FaFileImport />
                  <span>{i18n.import_from} crypto_size_attestations</span>
                </div>
              </Button>
            </li>
          </ul>
        </AttestationsHeaderRow>
      </AttestationsHeader>
      <div>
        <CryptoHolderSetTable />
      </div>
    </>
  );
};

export default CryptoHolderSet;

export interface CryptoHolderSetProps {}
