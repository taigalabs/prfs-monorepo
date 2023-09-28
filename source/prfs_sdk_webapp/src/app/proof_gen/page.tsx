"use client";

import React from "react";

import { i18nContext } from "@/contexts/i18n";
import { useProofGen } from "./useProofGen";

const ProofGen: React.FC<ProofGenProps> = () => {
  React.useEffect(() => {
    const proofGen = setupProofGen();
  }, []);

  return null;
};

export default ProofGen;

export interface ProofGenProps {}
