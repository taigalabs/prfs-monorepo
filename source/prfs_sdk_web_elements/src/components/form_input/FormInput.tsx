import React from "react";

import styles from "./FormInput.module.scss";
import { i18nContext } from "@/contexts/i18n";

export const FormInput: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.inputWrapper}>{children}</div>;
};

export const FormInputTitleRow: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.inputTitleRow}>{children}</div>;
};

export interface FormInputProps {
  children: React.ReactNode;
}
