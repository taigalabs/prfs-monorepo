"use client";

import React from "react";
import cn from "classnames";

import styles from "./CreateAttestation.module.scss";
import { AppMain, AppMainInner } from "@/components/app_components/AppComponents";

const CreateAttestation: React.FC<CreateAttestationProps> = ({ children }) => {
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
