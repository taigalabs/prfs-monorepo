import React from "react";
import { useRouter } from "next/navigation";

import styles from "./CreateProofForm.module.scss";
import { paths } from "@/paths";
import { i18nContext } from "@/contexts/i18n";

const CreateProofForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.proofTypeRow}>
        <p>{i18n.proof_type}</p>
        <div>input</div>
      </div>
      <div></div>
    </div>
  );
};

export default CreateProofForm;
