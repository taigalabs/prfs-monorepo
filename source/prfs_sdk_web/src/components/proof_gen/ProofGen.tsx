import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { PublicInputInstanceEntry } from "@taigalabs/prfs-entities/bindings/PublicInputInstanceEntry";

import i18n from "../../i18n/en";
import styles from "./ProofGen.module.scss";
import Button from "../button/Button";

const ProofGen: React.FC<ProofGenProps> = ({ proofType, handleCreateProof }) => {
  const publicInputElem = React.useMemo(() => {
    const obj: Record<any, PublicInputInstanceEntry> = proofType.public_input_instance;

    // label: string;
    // type: PublicInputType;
    // desc: string;
    // value: string;
    // ref: string | null;
    const entriesElem = Object.entries(obj).map(([key, val]) => {
      return (
        <div className={styles.publicInputEntry} key={key}>
          <div className={styles.entryMeta}>
            <div className={styles.entryKey}>{key}</div>
            <div className={styles.entryType}>{val.type}</div>
            <div className={styles.entryLabel}>{val.label}</div>
          </div>
          <div className={styles.entryValue}>{val.value}</div>
        </div>
      );
    });

    return entriesElem;
  }, [proofType]);

  return (
    proofType && (
      <div className={styles.wrapper}>
        <div className={styles.privateInputs}>
          <div className={styles.inputCategoryTitle}>{i18n.private_inputs}</div>
          <div className={styles.inputEntries}></div>
        </div>
        <div className={styles.publicInputInstance}>
          <div className={styles.inputCategoryTitle}>{i18n.public_inputs}</div>
          <div className={styles.inputEntries}>{publicInputElem}</div>
        </div>
        <div className={styles.btnRow}>
          <Button variant="b">{i18n.create_proof}</Button>
        </div>
        <div className={styles.powered}>{i18n.powered_by_prfs_web_sdk}</div>
      </div>
    )
  );
};

export default ProofGen;

export interface ProofGenProps {
  proofType: PrfsProofType;
  handleCreateProof: Function;
}
