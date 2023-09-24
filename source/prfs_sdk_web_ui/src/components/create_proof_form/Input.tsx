import React from "react";

import styles from "./Input.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { envs } from "@/envs";

const Input: React.FC<InputProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.inputWrapper}>
      {children}
      {/* <div className={styles.entryMeta}> */}
      {/*   <div className={styles.entryLabel}>{label}</div> */}
      {/* </div> */}
      {/* <div className={styles.inputContainer}>{children}</div> */}
    </div>
  );
};

export const InputTitleRow: React.FC<InputProps> = ({ children }) => {
  return <div className={styles.inputTitleRow}>{children}</div>;
};

export default Input;

export interface InputProps {
  children: React.ReactNode;
}
