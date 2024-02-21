import React from "react";
import cn from "classnames";
import DOMPurify from "dompurify";
import * as marked from "marked";
import dayjs from "dayjs";
import CaptionedImg from "@taigalabs/prfs-react-lib/src/captioned_img/CaptionedImg";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { JSONElem, iterateJSON } from "@taigalabs/prfs-ts-utils";

import styles from "./ProofTypeMeta.module.scss";
import { i18nContext } from "@/i18n/context";
import { Markdown } from "@/components/markdown/Markdown";
import CircuitTypeData from "./CircuitTypeData";

const ProofTypeMeta: React.FC<ProofTypeMetaProps> = ({ proofType }) => {
  const i18n = React.useContext(i18nContext);

  const mdHTML = React.useMemo(() => {
    try {
      const md = DOMPurify.sanitize(marked.parse(proofType.desc));
      return md;
    } catch (err) {
      console.error(err);
      return "";
    }
  }, [proofType.desc]);

  const circuitTypeData = React.useMemo(() => {
    const jsonElems = iterateJSON(proofType.circuit_type_data);
    console.log(33, jsonElems);

    const elems = [];

    for (const [idx, jsonElem] of jsonElems.entries()) {
      elems.push(
        <div key={idx} className={styles.row}>
          <p>{jsonElem.label}</p>
          <p>{jsonElem.value}</p>
        </div>,
      );
    }

    return elems;
  }, [proofType.circuit_type_data]);

  // const proofTypeUrl = React.useMemo(() => {
  //   const url = process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT + "/proof_types/" + proofTypeId;
  //   return url;
  // }, [proofTypeId]);

  const proofTypeCreatedAt = React.useMemo(() => {
    const createdAt = dayjs(proofType.created_at).format("YYYY-MM-DD");
    return createdAt;
  }, [proofType.created_at]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerSection}>
        <a>
          <div className={styles.top}>
            <div className={styles.left}>
              <div className={styles.imgContainer}>
                <CaptionedImg img_url={proofType.img_url} size={28} />
              </div>
            </div>
            <div className={styles.right}>
              <p>{proofType.proof_type_id}</p>
              <p className={styles.meta}>
                <span>New proof</span>
                <span>Not audited</span>
              </p>
              {/* <p className={styles.url}>{proofTypeUrl}</p> */}
            </div>
          </div>
          <span className={styles.title}>{proofType.label}</span>
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
          <p className={styles.value}>{proofType.author}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.label}>{i18n.proof_type_created_at}</p>
          <p className={styles.value}>{proofTypeCreatedAt}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.label}>{i18n.circuit_driver_id}</p>
          <p className={styles.value}>{proofType.circuit_driver_id}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.label}>{i18n.circuit_type_id}</p>
          <p className={styles.value}>{proofType.circuit_type_id}</p>
        </div>
        <div className={styles.entry}>
          <p className={styles.label}>{i18n.circuit_type_data}</p>
          <CircuitTypeData circuitTypeData={proofType.circuit_type_data} />
        </div>
      </div>
    </div>
  );
};

export default ProofTypeMeta;

export interface ProofTypeMetaProps {
  proofType: PrfsProofType;
}
