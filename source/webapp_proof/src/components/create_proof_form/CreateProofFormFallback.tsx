import React from "react";
import cn from "classnames";

import styles from "./CreateProofForm.module.scss";
import { getI18N } from "@/i18n/getI18N";
import ProofTypeMastheadFallback from "@/components/masthead/ProofTypeMastheadFallback";

const CreateProofFormFallback: React.FC = async () => {
  const i18n = await getI18N();

  return (
    <>
      <ProofTypeMastheadFallback />
      <div className={styles.wrapper}>
        <div
          className={cn({
            [styles.formWrapper]: true,
          })}
        >
          {i18n.create_proof_form}
        </div>
      </div>
    </>
  );
};

export default CreateProofFormFallback;

export interface ProofTypeItem {
  proofTypeId: string;
  label: string;
  imgUrl: string | null;
}
