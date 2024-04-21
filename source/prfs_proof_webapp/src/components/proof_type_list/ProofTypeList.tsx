"use client";

import React from "react";
import cn from "classnames";

import styles from "./ProofTypeList.module.scss";
import { i18nContext } from "@/i18n/context";
import ProofTypeTable from "@/components/proof_type_table/ProofTypeTable";
import { AppHeader, AppTitle } from "@/components/app_components/AppComponents";

const ProofTypeList: React.FC<ProofTypeListProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AppHeader>
        <AppTitle className={styles.title}>{i18n.proof_types}</AppTitle>
      </AppHeader>
      <div>
        <ProofTypeTable />
      </div>
    </>
  );
};

export default ProofTypeList;

export interface ProofTypeListProps {}
