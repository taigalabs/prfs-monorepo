"use client";

import React from "react";

import styles from "./CryptoSizeAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoSizeAtstTable from "./CryptoSizeAtstTable";
import { AttestationsTitle, AttestationsTopMenu } from "../attestations/AttestationComponents";

const CryptoSizeAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsTopMenu>po12</AttestationsTopMenu>
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
