import React from "react";
import cn from "classnames";

import styles from "./Select.module.scss";
import { Fieldset, InputError, InputWrapper, Label } from "../input/InputComponent";

const noop = () => {};

const Select: React.FC<SelectProps> = ({
  className,
  label,
  labelClassName,
  error,
  value,
  name,
  hasError,
  children,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);
  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);

  return (
    <>
      <InputWrapper
        className={className}
        isError={!!error || !!hasError}
        isFocused={isFocused}
        hasValue={value > -1}
      >
        <Label className={labelClassName} name={name}>
          {label}
        </Label>
        <Fieldset>{label}</Fieldset>
        <select
          className={styles.select}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChange={noop}
        >
          {children}
        </select>
      </InputWrapper>
      {error && <InputError>{error}</InputError>}
    </>
  );
};

export default Select;

export interface SelectProps {
  className?: string;
  labelClassName?: string;
  value: number;
  children: React.ReactNode;
  error?: React.ReactNode;
  hasError?: boolean;
  label: string;
  name: string;
}
