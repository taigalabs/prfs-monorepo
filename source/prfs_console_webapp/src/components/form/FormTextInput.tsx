import React, { ChangeEventHandler } from "react";

import styles from "./Form.module.scss";

const FormTextInput: React.FC<FormTextInputProps> = ({
  type,
  label,
  value,
  handleChange,
  name,
}) => {
  const inputType = type ? type : "text";

  return (
    <div className={styles.formTextInputWrapper}>
      <div className={styles.label}>{label}</div>
      <div>
        <input
          name={name}
          className={styles.readOnly}
          type={inputType}
          value={value || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FormTextInput;

export interface FormTextInputProps {
  name: string;
  label: string;
  value?: string | number;
  handleChange?: ChangeEventHandler;
  type?: string;
}
