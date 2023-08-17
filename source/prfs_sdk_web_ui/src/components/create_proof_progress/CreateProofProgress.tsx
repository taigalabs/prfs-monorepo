import React from "react";
// import { RiArrowUpSLine } from "react-icons/ri";

import styles from "./CreateProofProgress.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

const CreateProofProgress: React.FC<CreateProofProgressProps> = ({ terminalLog }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.guide}>
        <p className={styles.title}>{i18n.proof_creation}</p>
        <p dangerouslySetInnerHTML={{ __html: i18n.start_create_proof_guide_1 }} />
        <p>{i18n.start_create_proof_guide_2}</p>
        <p>{i18n.start_create_proof_guide_3}</p>
      </div>
      <div className={styles.terminal}>{terminalLog}</div>
    </div>
  );
};

export default CreateProofProgress;

export interface CreateProofProgressProps {
  terminalLog: React.ReactNode;
}
