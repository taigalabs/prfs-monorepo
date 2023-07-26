import React from "react";
import Link from "next/link";
import classnames from "classnames";

import styles from "./CreateProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";

const CreateProofTypeForm: React.FC<CreateProofTypeFormProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <Widget label={i18n.connect_wallet} className={styles.wrapper}>
      dir
    </Widget>
  );
};

export default CreateProofTypeForm;

export interface CreateProofTypeFormProps {}
