import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./CreateProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SelectProofTypeDialog from "@/components/select_proof_type_dialog/SelectProofTypeDialog";

const CreateProofForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.proofTypeRow}>
        <p>{i18n.you_would_like_to_prove}</p>
        <div className={styles.select}>
          <SelectProofTypeDialog />
        </div>
      </div>
      <div></div>
      <div className={styles.createProofBtn}>
        <Button variant="aqua_blue_1" handleClick={() => {}}>
          {i18n.create_proof.toUpperCase()}
        </Button>
      </div>
    </div>
  );
};

export default CreateProofForm;
