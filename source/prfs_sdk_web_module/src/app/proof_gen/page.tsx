"use client";

import React from "react";

const state = {
  isBusy: false,
};

const ProofGen: React.FC<ProofGenProps> = () => {
  React.useEffect(() => {
    async function fn() {
      if (!state.isBusy) {
        state.isBusy = true;
        try {
          const { setupProofGen } = await import("./setupProofGen");

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

  return <></>;
};

export default ProofGen;

export interface ProofGenProps {}
