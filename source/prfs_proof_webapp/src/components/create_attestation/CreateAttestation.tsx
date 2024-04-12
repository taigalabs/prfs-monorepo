"use client";

import React from "react";
import cn from "classnames";

import styles from "./CreateAttestation.module.scss";
import { i18nContext } from "@/i18n/context";
import { AppMain, AppMainInner } from "@/components/app_components/AppComponents";

const CreateAttestation: React.FC<CreateAttestationProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <AppMain>
      <AppMainInner>
        <div className={styles.wrapper}>{children}</div>
      </AppMainInner>
    </AppMain>
  );
};

export default CreateAttestation;

export interface CreateAttestationProps {
  children?: React.ReactNode;
}
