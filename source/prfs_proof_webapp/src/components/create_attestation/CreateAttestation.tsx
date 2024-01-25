"use client";

import React from "react";
import cn from "classnames";

import styles from "./CreateAttestation.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";

const CreateAttestation: React.FC<CreateAttestationProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <AttestationsMain>
      <AttestationsMainInner>
        <div className={styles.wrapper}>{children}</div>
      </AttestationsMainInner>
    </AttestationsMain>
  );
};

export default CreateAttestation;

export interface CreateAttestationProps {
  children?: React.ReactNode;
}
