import React, { HTMLInputTypeAttribute } from "react";
import cn from "classnames";

import styles from "./Input.module.scss";

const Input: React.FC<InputProps> = ({
  className,
  inputClassName,
  labelClassName,
  label,
  name,
  value,
  error,
  type,
  disabled,
  readOnly,
  // placeholder,
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
      className={cn(styles.wrapper, className, {
        [styles.isError]: !!error,
        [styles.isFocused]: isFocused,
        [styles.hasValue]: value.length > 0,
      })}
    >
      <div className={cn(styles.label, labelClassName)}>
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
        className={cn(styles.input, inputClassName)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type={type}
        onChange={handleChangeValue}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        disabled={disabled}
      />
      {error && error.length && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Input;

export interface InputProps {
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  name?: string;
  value: string;
  label: string;
  handleChangeValue?: React.ChangeEventHandler;
  handleKeyDown?: React.KeyboardEventHandler;
  error?: string | undefined;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
  readOnly?: boolean;
}
