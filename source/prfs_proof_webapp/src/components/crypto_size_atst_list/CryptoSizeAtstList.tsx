"use client";

import React from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";

import styles from "./CryptoSizeAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoSizeAtstTable from "./CryptoSizeAtstTable";
import {
  AttestationsHeader,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";

const CryptoSizeAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsHeader>
        <AttestationsTitle className={styles.title}>
          {i18n.crypto_asset_size_attestations}
        </AttestationsTitle>
        <AttestationsTopMenu>
          <li>
            <Button variant="circular_gray_1">
              <FaCalculator />
            </Button>
          </li>
        </AttestationsTopMenu>
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
