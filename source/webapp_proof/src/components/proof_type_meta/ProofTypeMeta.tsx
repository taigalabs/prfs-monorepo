import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";
import DOMPurify from "dompurify";
import * as marked from "marked";

import styles from "./ProofTypeMeta.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";

const ProofTypeMeta: React.FC<ProofTypeMetaProps> = ({
  proofTypeDesc,
  proofTypeId,
  imgUrl,
  proofTypeLabel,
  proofTypeAuthor,
  circuitTypeId,
  circuitDriverId,
  proofTypeCreatedAt,
}) => {
  const i18n = React.useContext(i18nContext);

  const [mdHTML, proofTypeUrl] = React.useMemo(() => {
    const url = process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT + "/proof_types/" + proofTypeId;

    try {
      const md = DOMPurify.sanitize(marked.parse(proofTypeDesc));
      return [md, url];
    } catch (err) {
      console.error(err);
      return ["", url];
    }
  }, [proofTypeId, proofTypeDesc]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerSection}>
        <a href={proofTypeUrl}>
          <div className={styles.top}>
            <div className={styles.left}>
              <div className={styles.imgContainer}>
                <CaptionedImg img_url={imgUrl} size={18} />
              </div>
            </div>
            <div>
              <p>{proofTypeId}</p>
              <p className={styles.url}>{proofTypeUrl}</p>
            </div>
          </div>
          <span className={styles.title}>{proofTypeLabel}</span>
        </a>
      </div>
      <div className={styles.section}>
        <div dangerouslySetInnerHTML={{ __html: mdHTML }} />
      </div>
      <div className={styles.section}>
        <div className={styles.entry}>
          <p className={styles.h2}>{i18n.proof_type_author}</p>
          <p>{proofTypeAuthor}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.h2}>{i18n.proof_type_created_at}</p>
          <p>{proofTypeCreatedAt}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.h2}>{i18n.circuit_driver_id}</p>
          <p>{circuitDriverId}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.h2}>{i18n.circuit_type_id}</p>
          <p>{circuitTypeId}</p>
        </div>
      </div>
    </div>
  );
};

export default ProofTypeMeta;

export interface ProofTypeMetaProps {
  proofTypeDesc: string;
  proofTypeId: string;
  imgUrl: string | null;
  proofTypeLabel: string;
  proofTypeAuthor: string;
  circuitTypeId: string;
  circuitDriverId: string;
  proofTypeCreatedAt: string;
}
