import React, { HTMLInputTypeAttribute } from "react";
import cn from "classnames";

import styles from "./ImageLogo.module.scss";

// export const Input: React.FC<InputProps> = ({ placeholder }) => {
//   return (
//     <div className={styles.input}>
//       <input placeholder={placeholder} />
//     </div>
//   );
// };

export const Input: React.FC<InputProps> = ({
  className,
  name,
  value,
  error,
  type,
  placeholder,
  handleChangeValue,
  handleKeyDown,
}) => {
  return (
    <div
      className={cn(styles.inputWrapper, className, {
        [styles.isError]: !!error,
      })}
    >
      <input
        name={name}
        value={value}
        className={styles.input}
        placeholder={placeholder}
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
  handleChangeValue: React.ChangeEventHandler;
  handleKeyDown?: React.KeyboardEventHandler;
  error: string | undefined;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
}
