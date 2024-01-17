"use client";

import React from "react";

import styles from "./CryptoSizeAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTitle } from "@/components/attestations/Attestations";
import CryptoSizeAtstTable from "./CryptoSizeAtstTable";

const CryptoSizeAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsTitle className={styles.title}>
        {i18n.crypto_asset_size_attestations}
      </AttestationsTitle>
      <div>
        <CryptoSizeAtstTable />
      </div>
    </>
  );
};

export default CryptoSizeAtstList;

export interface CryptoSizeAtstListProps {}
