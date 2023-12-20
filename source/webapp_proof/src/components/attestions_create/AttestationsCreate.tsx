"use client";

import React from "react";
import cn from "classnames";

import styles from "./AttestationCreate.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsMain } from "@/components/attestations/Attestations";

const AttestationsCreate: React.FC<AttestationsCreateProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  return <AttestationsMain>create</AttestationsMain>;
};

export default AttestationsCreate;

export interface AttestationsCreateProps {}
