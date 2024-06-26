import React from "react";

import styles from "./Form.module.scss";

export const FormTitleRow: React.FC<FormTitleRowProps> = ({ children }) => {
  return <div className={styles.formTitleRowWrapper}>{children}</div>;
};

export const FormTitle: React.FC<FormTitleProps> = ({ children }) => {
  return <div className={styles.formTitleWrapper}>{children}</div>;
};

export const FormSubtitle: React.FC<FormSubtitleProps> = ({ children }) => {
  return <div className={styles.formSubtitleWrapper}>{children}</div>;
};

export interface FormTitleProps {
  children: React.ReactNode;
}

export interface FormSubtitleProps {
  children: React.ReactNode;
}

export interface FormTitleRowProps {
  children: React.ReactNode;
}
