import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";
import DOMPurify from "dompurify";
import marked from "marked";

import styles from "./ProofTypeMeta.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TutorialStepper from "@/components/tutorial/TutorialStepper";

const ProofTypeMeta: React.FC<ProofTypeMetaProps> = ({ proofType }) => {
  const { desc } = proofType;
  const el = React.useMemo(() => {
    const md = marked.parse(desc);
    const res = DOMPurify.sanitize(md);

    return res;
  }, [desc]);

  console.log(11, el);

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>About {proofType.label}</p>
    </div>
  );
};

export default ProofTypeMeta;

export interface ProofTypeMetaProps {
  proofType: PrfsProofType;
}
