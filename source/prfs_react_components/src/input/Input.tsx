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
    console.log(221);
    setIsFocused(true);
  }, [setIsFocused]);

  const handleBlur = React.useCallback(() => {
    console.log(11);
    setIsFocused(false);
  }, [setIsFocused]);

  console.log(isFocused);

  return (
    <div
      className={cn(styles.inputWrapper, className, {
        [styles.isError]: !!error,
        [styles.isFocused]: isFocused,
      })}
    >
      <span className={styles.label}>{label}</span>
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

// export interface InputProps {
//   placeholder?: string;
// }

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
