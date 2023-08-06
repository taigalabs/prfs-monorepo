import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import styles from "./ProofGen.module.scss";

const ProofGen: React.FC<ProofGenProps> = ({ proofType, handleCreateProof }) => {
  return (
    <div className={styles.thisWillBeEncapsulatedInIframe}>
      <div>public input</div>
      <div>33aa</div>
    </div>
  );
};

export default ProofGen;

export interface ProofGenProps {
  proofType: PrfsProofType;
  handleCreateProof: Function;
}
