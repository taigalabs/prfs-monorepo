import React from "react";

import styles from "./CreateProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { envs } from "@/envs";

const Input: React.FC<InputProps> = ({ children, label }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.circuitInputEntry}>
      <div className={styles.entryMeta}>
        <div className={styles.entryLabel}>{label}</div>
      </div>
      <div className={styles.inputContainer}>{children}</div>
    </div>
  );
};

export default Input;

export interface InputProps {
  label: string;
  children: React.ReactNode;
}
