"use client";

import React from "react";

import styles from "./CryptoSizeAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoSizeAtstTable from "./CryptoSizeAtstTable";
import {
  AttestationsHeader,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import { AttestationsTopMenu } from "../sets/SetComponents";

const CryptoSizeAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsHeader>
        <AttestationsTitle className={styles.title}>
          {i18n.crypto_asset_size_attestations}
        </AttestationsTitle>
        <AttestationsTopMenu>33</AttestationsTopMenu>
      </AttestationsHeader>
      {/* <div> */}
      {/*   <p>123</p> */}
      {/* </div> */}
      <div>
        <CryptoSizeAtstTable />
      </div>
    </>
  );
};

export default CryptoSizeAtstList;

export interface CryptoSizeAtstListProps {}
