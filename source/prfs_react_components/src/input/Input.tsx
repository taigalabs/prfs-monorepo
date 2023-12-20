import React, { HTMLInputTypeAttribute } from "react";
import cn from "classnames";

import styles from "./Input.module.scss";

export const Input: React.FC<InputProps> = ({
  className,
  label,
  name,
  value,
  error,
  type,
  placeholder,
  handleChangeValue,
  handleKeyDown,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);
  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);

  return (
    <div
      className={cn(styles.inputWrapper, className, {
        [styles.isError]: !!error,
        [styles.isFocused]: isFocused,
        [styles.hasValue]: value.length > 0,
      })}
    >
      <div className={styles.label}>
        <label htmlFor={name}>{label}</label>
      </div>
      <fieldset className={styles.fieldset}>
        <legend>
          <span>{label}</span>
        </legend>
      </fieldset>
      <input
        name={name}
        value={value}
        className={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type={type}
        onChange={handleChangeValue}
        onKeyDown={handleKeyDown}
      />
      {error && error.length && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export interface InputProps {
  className?: string;
  name?: string;
  value: string;
  label: string;
  handleChangeValue: React.ChangeEventHandler;
  handleKeyDown?: React.KeyboardEventHandler;
  error: string | undefined;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
}
