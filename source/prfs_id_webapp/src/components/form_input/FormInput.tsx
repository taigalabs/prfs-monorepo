import React from "react";

import styles from "./FormInput.module.scss";

export const FormInput: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.formInput}>{children}</div>;
};

export const FormInputTitle: React.FC<FormInputProps> = ({ children }) => {
  return <p className={styles.inputTitle}>{children}</p>;
};

export const FormInputBtnRow: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.btnRow}>{children}</div>;
};

export const FormInputTitleRow: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.inputTitleRow}>{children}</div>;
};

export const InputWrapper: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.inputWrapper}>{children}</div>;
};

export const FormError: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.formError}>{children}</div>;
};

export interface FormInputProps {
  children: React.ReactNode;
}
