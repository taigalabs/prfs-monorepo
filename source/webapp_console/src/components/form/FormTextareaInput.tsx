import React, { ChangeEventHandler } from "react";

import styles from "./Form.module.scss";

const FormTextareaInput: React.FC<FormTextareaInputProps> = ({
  name,
  label,
  value,
  handleChange,
  rows,
}) => {
  return (
    <div className={styles.formTextInputWrapper}>
      <div className={styles.label}>{label}</div>
      <div>
        <textarea
          name={name}
          className={styles.readOnly}
          value={value || ""}
          rows={rows}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FormTextareaInput;

export interface FormTextareaInputProps {
  name: string;
  label: string;
  value?: string | number;
  handleChange?: ChangeEventHandler;
  rows?: number;
}
