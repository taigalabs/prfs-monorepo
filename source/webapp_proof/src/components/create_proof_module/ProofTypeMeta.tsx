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

  const [mdHTML, url] = React.useMemo(() => {
    const { desc } = proofType;
    const md = DOMPurify.sanitize(marked.parse(desc));

    const url =
      process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT + "/proof_types/" + proofType.proof_type_id;

    return [md, url];
  }, [proofType]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerSection}>
        <div className={styles.left}>
          <div className={styles.imgContainer}>
            <CaptionedImg img_url={proofType.img_url} size={18} />
          </div>
        </div>
        <div>
          <p>{proofType.proof_type_id}</p>
          <p className={styles.url}>{url}</p>
        </div>
      </div>
      <div className={styles.section}>
        <p className={styles.title}>{proofType.label}</p>
        <div dangerouslySetInnerHTML={{ __html: mdHTML }} />
        <p className={styles.h2}>{i18n.author}</p>
        <p>{proofType.author}</p>
      </div>
    </div>
  );
};

export default ProofTypeMeta;

export interface ProofTypeMetaProps {
  proofType: PrfsProofType;
}
