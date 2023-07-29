import React from "react";

import styles from "./Form.module.scss";

const FormTextInput: React.FC<FormTextInputProps> = ({ type, label, value, handleChange }) => {
  const inputType = type ? type : "text";

  return (
    <div className={styles.formTextInputWrapper}>
      <div className={styles.label}>{label}</div>
      <div>
        {value ? (
          <input className={styles.readOnly} type={inputType} value={value} readOnly />
        ) : (
          <input type={inputType} onChange={handleChange} />
        )}
      </div>
    </div>
  );
};

export default FormTextInput;

export interface FormTextInputProps {
  label: string;
  value?: string | number;
  handleChange?: (ev: any) => void;
  type?: string;
}
