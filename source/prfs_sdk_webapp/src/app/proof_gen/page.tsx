"use client";

import React from "react";
import { setupProofGen } from "./setupProofGen";

const state = {
  isBusy: false,
};

const ProofGen: React.FC<ProofGenProps> = () => {
  React.useEffect(() => {
    async function fn() {
      if (!state.isBusy) {
        state.isBusy = true;
        console.log(123123);
        try {
          const prfGen = await setupProofGen();
        } catch (err) {
          state.isBusy = false;
        }
      }
    }

    fn().then();
  }, []);

  return null;
};

export default ProofGen;

export interface ProofGenProps {}
