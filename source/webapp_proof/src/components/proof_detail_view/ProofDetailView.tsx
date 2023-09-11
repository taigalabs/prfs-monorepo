import React from "react";
import Link from "next/link";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const ProofDetailView: React.FC<ProofDetailViewProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  const shortUrl = `${process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/p/${proofInstance.short_id}`;

  return (
    <div className={styles.wrapper}>
      <div>
        <p className={styles.label}>{proofInstance.proof_label}</p>
        <p className={styles.desc}>{proofInstance.proof_desc}</p>
      </div>
      <div>
        <div className={styles.url}>
          <p>{shortUrl}</p>
          <button>
            <AiOutlineCopy />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProofDetailView;

export interface ProofDetailViewProps {
  proofInstance: PrfsProofInstanceSyn1;
}
