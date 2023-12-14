import React from "react";
import Link from "next/link";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const ProofDetailView: React.FC<ProofDetailViewProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  const url = `${process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/proof_instances/${proofInstance.proof_instance_id}`;

  return (
    <div className={styles.wrapper}>
      <div>
        <p className={styles.label}>{proofInstance.proof_type_label}</p>
        <p className={styles.desc}>{proofInstance.proof_type_desc}</p>
      </div>
      <div className={styles.link}>
        <Link href={url}>{i18n.see_more}</Link>
      </div>
    </div>
  );
};

export default ProofDetailView;

export interface ProofDetailViewProps {
  proofInstance: PrfsProofInstanceSyn1;
}
