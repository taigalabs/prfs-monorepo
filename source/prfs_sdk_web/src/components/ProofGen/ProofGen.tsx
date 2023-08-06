import React from "react";

import styles from "./ProofGen.module.scss";

const ProofGen: React.FC<ProofGenProps> = ({ proofType }) => {
  return <div className={styles.thisWillBeEncapsulatedInIframe}>Prfs Web SDK</div>;
};

export default ProofGen;

export interface ProofGenProps {
  proofType: any;
}
