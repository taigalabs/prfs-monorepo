import React from "react";
import cn from "classnames";

import styles from "./FormInput.module.scss";

export const FormInput: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.formInput}>{children}</div>;
};

export const FormInputType: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.inputType}>{children}</div>;
};

export const FormInputTitle: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.inputTitle}>{children}</div>;
};

export const FormInputBtnRow: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.btnRow}>{children}</div>;
};

export const FormInputTitleRow: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.inputTitleRow}>{children}</div>;
};

export const InputGroup: React.FC<FormInputProps> = ({ children, className }) => {
  return <div className={cn(styles.inputGroup, className)}>{children}</div>;
};

export const InputWrapper: React.FC<FormInputProps> = ({ children, className }) => {
  return <div className={cn(styles.inputWrapper, className)}>{children}</div>;
};

export const FormError: React.FC<FormInputProps> = ({ children }) => {
  return <div className={styles.formError}>{children}</div>;
};

export interface FormInputProps {
  children: React.ReactNode;
  className?: string;
}
