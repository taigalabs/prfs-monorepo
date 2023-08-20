import React, { ChangeEventHandler } from "react";

import styles from "./Form.module.scss";

const FormTextareaInput: React.FC<FormTextareaInputProps> = ({
  label,
  value,
  handleChange,
  rows,
}) => {
  return (
    <div className={styles.formTextInputWrapper}>
      <div className={styles.label}>{label}</div>
      <div>
        {value ? (
          <textarea className={styles.readOnly} value={value} readOnly rows={rows} />
        ) : (
          <textarea onChange={handleChange} rows={rows} />
        )}
      </div>
    </div>
  );
};

export default FormTextareaInput;

export interface FormTextareaInputProps {
  label: string;
  value?: string | number;
  handleChange?: ChangeEventHandler;
  rows?: number;
}
