import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";
import DOMPurify from "dompurify";
import * as marked from "marked";

import styles from "./ProofTypeMeta.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";

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
      <div className={styles.headerSection}>
        <div className={styles.left}>
          <CaptionedImg img_url={proofType.img_url} size={28} />
        </div>
        <div>
          <p>{proofType.proof_type_id}</p>
          <p>{`${process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/proof_types/${proofType.proof_type_id}`}</p>
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
