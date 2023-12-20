"use client";

import React from "react";
import cn from "classnames";

import styles from "./AttestationCreate.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsMain, AttestationsTitle } from "@/components/attestations/Attestations";

const AttestationsCreate: React.FC<AttestationsCreateProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return <AttestationsMain>{children}</AttestationsMain>;
};

export default AttestationsCreate;

export interface AttestationsCreateProps {
  children?: React.ReactNode;
}
