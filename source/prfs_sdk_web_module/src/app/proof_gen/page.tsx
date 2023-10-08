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
        try {
          const prfGen = await setupProofGen();
        } catch (err) {
          state.isBusy = false;
        }
      } else {
        console.log("Busy, aborting request");
      }
    }

    fn().then();
  }, []);

  return <>Loaded</>;
};

export default ProofGen;

export interface ProofGenProps {}
