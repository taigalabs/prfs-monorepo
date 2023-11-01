import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import cn from "classnames";

import styles from "./ProofTypeMeta.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TutorialStepper from "@/components/tutorial/TutorialStepper";

const ProofTypeMeta: React.FC<ProofTypeMetaProps> = ({ proofType }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.proofTypeLabel}>About {proofType.label}</p>
    </div>
  );
};

export default ProofTypeMeta;

export interface ProofTypeMetaProps {
  proofType: PrfsProofType;
}
