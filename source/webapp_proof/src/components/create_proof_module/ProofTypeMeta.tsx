import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";
import DOMPurify from "dompurify";
import * as marked from "marked";

import styles from "./ProofTypeMeta.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TutorialStepper from "@/components/tutorial/TutorialStepper";

const ProofTypeMeta: React.FC<ProofTypeMetaProps> = ({ proofType }) => {
  const i18n = React.useContext(i18nContext);

  const { desc } = proofType;
  const mdHTML = React.useMemo(() => {
    const md = marked.parse(desc);
    const res = DOMPurify.sanitize(md);
    return res;
  }, [desc]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <div className={styles.left}></div>
        <div>
          <p className={styles.title}>{i18n.author}</p>
          <p>{proofType.author}</p>
        </div>
      </div>
      <div className={styles.section}>
        <p className={styles.title}>{proofType.label}</p>
        <div dangerouslySetInnerHTML={{ __html: mdHTML }} />
      </div>
    </div>
  );
};

export default ProofTypeMeta;

export interface ProofTypeMetaProps {
  proofType: PrfsProofType;
}
