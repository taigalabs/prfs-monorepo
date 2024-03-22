import React from "react";
import cn from "classnames";

import styles from "./InputComponent.module.scss";

export const InputWrapper: React.FC<InputWrapperProps> = ({
  children,
  className,
  isError,
  isFocused,
  hasValue,
}) => {
  return (
    <div
      className={cn(styles.wrapper, className, {
        [styles.isError]: isError,
        [styles.isFocused]: isFocused,
        [styles.hasValue]: hasValue,
      })}
    >
      {children}
    </div>
  );
};

export const Label: React.FC<LabelProps> = ({ children, className, name }) => {
  return (
    <div className={cn(styles.label, className)}>
      <label htmlFor={name}>{children}</label>
    </div>
  );
};

export const Fieldset: React.FC<FieldsetProps> = ({ children }) => {
  return (
    <fieldset className={styles.fieldset}>
      <legend>
        <span>{children}</span>
      </legend>
    </fieldset>
  );
};

export interface InputWrapperProps {
  children: React.ReactNode;
  className?: string;
  isError: boolean;
  isFocused: boolean;
  hasValue: boolean;
}

export interface LabelProps {
  children: React.ReactNode;
  className?: string;
  name: string | undefined;
  // label: string;
}

export interface FieldsetProps {
  children: React.ReactNode;
}
