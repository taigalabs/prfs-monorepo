import React from "react";
import cn from "classnames";
import DOMPurify from "dompurify";
import * as marked from "marked";
import dayjs from "dayjs";

import styles from "./ProofTypeMeta.module.scss";
import { i18nContext } from "@/i18n/context";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";
import { Markdown } from "../markdown/Markdown";

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

  const mdHTML = React.useMemo(() => {
    try {
      const md = DOMPurify.sanitize(marked.parse(proofTypeDesc));
      return md;
    } catch (err) {
      console.error(err);
      return "";
    }
  }, [proofTypeDesc]);

  const proofTypeUrl = React.useMemo(() => {
    const url = process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT + "/proof_types/" + proofTypeId;
    return url;
  }, [proofTypeId]);

  const _proofTypeCreatedAt = React.useMemo(() => {
    const createdAt = dayjs(proofTypeCreatedAt).format("YYYY-MM-DD");
    return createdAt;
  }, [proofTypeCreatedAt]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerSection}>
        <a href={proofTypeUrl}>
          <div className={styles.top}>
            <div className={styles.left}>
              <div className={styles.imgContainer}>
                <CaptionedImg img_url={imgUrl} size={28} />
              </div>
            </div>
            <div className={styles.right}>
              <p>{proofTypeId}</p>
              <p className={styles.meta}>
                <span>New proof</span>
                <span>Not audited</span>
              </p>
              {/* <p className={styles.url}>{proofTypeUrl}</p> */}
            </div>
          </div>
          <span className={styles.title}>{proofTypeLabel}</span>
        </a>
      </div>
      <div className={styles.descSection}>
        <Markdown>
          <div dangerouslySetInnerHTML={{ __html: mdHTML }} />
        </Markdown>
      </div>
      <div className={cn(styles.section, styles.miscSection)}>
        <div className={styles.entry}>
          <p className={styles.label}>{i18n.proof_type_author}</p>
          <p className={styles.value}>{proofTypeAuthor}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.label}>{i18n.proof_type_created_at}</p>
          <p className={styles.value}>{_proofTypeCreatedAt}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.label}>{i18n.circuit_driver_id}</p>
          <p className={styles.value}>{circuitDriverId}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.label}>{i18n.circuit_type_id}</p>
          <p className={styles.value}>{circuitTypeId}</p>
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
