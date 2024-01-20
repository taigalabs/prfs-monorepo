"use client";

import React from "react";
import cn from "classnames";

import styles from "./CreateAttestation.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsMain } from "@/components/attestations/Attestations";

const CreateAttestation: React.FC<CreateAttestationProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <AttestationsMain>
      <div className={styles.wrapper}>{children}</div>
    </AttestationsMain>
  );
};

export default CreateAttestation;

export interface CreateAttestationProps {
  children?: React.ReactNode;
}
