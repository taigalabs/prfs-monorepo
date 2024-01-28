"use client";

import React from "react";
import cn from "classnames";

import styles from "./ProofTypeList.module.scss";
import { i18nContext } from "@/i18n/context";
import ProofTypeTable from "./ProofTypeTable";
import {
  AttestationsHeader,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";

const ProofTypeList: React.FC<ProofTypeListProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsHeader>
        <AttestationsTitle className={styles.title}>{i18n.proof_types}</AttestationsTitle>
      </AttestationsHeader>
      <div>
        <ProofTypeTable />
      </div>
    </>
  );
};

export default ProofTypeList;

export interface ProofTypeListProps {}
