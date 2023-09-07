import React from "react";
import { useRouter } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./CreateProofForm.module.scss";
import { paths } from "@/paths";
import { i18nContext } from "@/contexts/i18n";

const CreateProofForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.proofTypeRow}>
        <p>{i18n.you_would_like_to_prove}</p>
        <div className={styles.select}>
          <span>{i18n.choose_type}</span>
        </div>
      </div>
      <div></div>
      <div className={styles.btnContainer}>
        <Button variant="aqua_blue_1" handleClick={() => {}}>
          {i18n.create_proof.toUpperCase()}
        </Button>
      </div>
    </div>
  );
};

export default CreateProofForm;
