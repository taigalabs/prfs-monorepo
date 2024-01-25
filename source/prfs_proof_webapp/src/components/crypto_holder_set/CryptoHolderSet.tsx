"use client";

import React from "react";
import cn from "classnames";

import styles from "./CryptoHolderSet.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoHolderSetTable from "./CryptoHolderSetTable";
import {
  AttestationsHeader,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";

const CryptoHolderSet: React.FC<CryptoHolderSetProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsHeader>
        <AttestationsTitle className={styles.title}>{i18n.crypto_holders}</AttestationsTitle>
      </AttestationsHeader>
      <div>
        <CryptoHolderSetTable />
      </div>
    </>
  );
};

export default CryptoHolderSet;

export interface CryptoHolderSetProps {}
