import React from "react";
import Link from "next/link";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const ProofDetailView: React.FC<ProofDetailViewProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  console.log(22, proofInstance);

  return (
    <div className={styles.wrapper}>
      <div>
        <p className={styles.label}>{proofInstance.proof_label}</p>
        <p className={styles.desc}>{proofInstance.proof_desc}</p>
      </div>
    </div>
  );
};

export default ProofDetailView;

export interface ProofDetailViewProps {
  proofInstance: PrfsProofInstanceSyn1;
}
